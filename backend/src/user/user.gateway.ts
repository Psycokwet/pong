import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import { Socket } from 'socket.io';
import { UsersService } from './user.service';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UsersService) {}
  public static userWebsockets: UsersWebsockets[] = [];

  @WebSocketServer()
  server: Server;
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.userService.getUserFromSocket(client);

      console.log(`New user connection: ${user.id}`);
      if (!user) return;
      const isRegistered = UserGateway.userWebsockets.find(
        (element) => element.userId === user.id,
      );

      if (!isRegistered) {
        const newWebsocket = { userId: user.id, socketId: client.id };
        UserGateway.userWebsockets = [
          ...UserGateway.userWebsockets,
          newWebsocket,
        ];
        console.log(UserGateway.userWebsockets);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    UserGateway.userWebsockets = UserGateway.userWebsockets.filter(
      (websocket) => websocket.socketId !== client.id,
    );
  }
}
