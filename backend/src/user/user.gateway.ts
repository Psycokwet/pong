import {
  BadRequestException,
  forwardRef,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ROUTES_BASE } from 'shared/websocketRoutes/routes';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import { Socket } from 'socket.io';
import { JwtWsGuard, UserPayload } from 'src/auth/jwt-ws.guard';
import { UsersService } from './user.service';
import AddFriend from 'shared/interfaces/AddFriend';
import { Status, UserInterface } from 'shared/interfaces/UserInterface';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  public static userWebsockets: UsersWebsockets[] = [];

  @WebSocketServer()
  server: Server;
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.userService.getUserFromSocket(client);

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
        const newUserConnected: UserInterface = {
          id: user.id,
          pongUsername: user.pongUsername,
          status: Status.ONLINE,
        };
        this.server.emit(ROUTES_BASE.USER.CONNECTION_CHANGE, newUserConnected);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = await this.userService.getUserFromSocket(client);

    UserGateway.userWebsockets = UserGateway.userWebsockets.filter(
      (websocket) => websocket.socketId !== client.id,
    );

    const disconnectingUser: UserInterface = {
      id: user.id,
      pongUsername: user.pongUsername,
      status: Status.OFFLINE,
    };
    this.server.emit(ROUTES_BASE.USER.CONNECTION_CHANGE, disconnectingUser);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.USER.ADD_FRIEND_REQUEST)
  async addFriend(
    @MessageBody() friendToAdd: AddFriend,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const friend = await this.userService.findOneByPongUsername(
      friendToAdd.pongUsername,
    );

    if (!friend) {
      throw new BadRequestException({ error: 'User not found' });
    }

    const caller = await this.userService.getById(payload.userId);

    await this.userService.addFriend(friend, caller);

    this.server.in(client.id).emit(ROUTES_BASE.USER.ADD_FRIEND_CONFIRMATION, {
      newFriend: friendToAdd.pongUsername,
    });
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.USER.FRIEND_LIST_REQUEST)
  async friendList(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const caller = await this.userService.getById(/*payload.*/ userId);

    const orderedFriendsList = await this.userService.getFriendsList(caller);

    this.server
      .in(client.id)
      .emit(ROUTES_BASE.USER.FRIEND_LIST_CONFIRMATION, orderedFriendsList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.USER.GET_STATUS_REQUEST)
  async getStatus(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {}
}