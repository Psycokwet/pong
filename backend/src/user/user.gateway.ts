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
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ROUTES_BASE } from 'shared/websocketRoutes/routes';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import { Socket } from 'socket.io';
import { JwtWsGuard, UserPayload } from 'src/auth/jwt-ws.guard';
import { UsersService } from './user.service';
import AddFriend from 'shared/interfaces/AddFriend';
import { Status, UserInterface } from 'shared/interfaces/UserInterface';
import UserId from 'shared/interfaces/UserId';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.userService.getUserFromSocket(client);

      if (!user) return;
      const isRegistered = UsersService.userWebsockets.find(
        (element) => element.userId === user.id,
      );

      if (!isRegistered) {
        const newWebsocket = { userId: user.id, socketId: client.id };
        UsersService.userWebsockets = [
          ...UsersService.userWebsockets,
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
    try {
      const user = await this.userService.getUserFromSocket(client);

      UsersService.userWebsockets = UsersService.userWebsockets.filter(
        (websocket) => websocket.socketId !== client.id,
      );

      const disconnectingUser: UserInterface = {
        id: user.id,
        pongUsername: user.pongUsername,
        status: Status.OFFLINE,
      };
      this.server.emit(ROUTES_BASE.USER.CONNECTION_CHANGE, disconnectingUser);
    } catch (e) {
      console.error(e.message);
      return;
    }
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
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const caller = await this.userService.getById(payload.userId);

    const orderedFriendsList = await this.userService.getFriendsList(caller);

    this.server
      .in(client.id)
      .emit(ROUTES_BASE.USER.FRIEND_LIST_CONFIRMATION, orderedFriendsList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.USER.BLOCK_USER_REQUEST)
  async blockUser(
    @MessageBody() data: UserId,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const userToBlock = await this.userService.getById(data.id);
    const caller = await this.userService.getById(payload.userId);

    if (!userToBlock || !caller) {
      throw new WsException({ error: 'User not found' });
    }

    await this.userService.addBlockedUser(userToBlock, caller);

    this.server.in(client.id).emit(ROUTES_BASE.USER.BLOCK_USER_CONFIRMATION, {
      pongUsername: userToBlock.pongUsername,
    });

    this.server
      .in(client.id)
      .emit(
        ROUTES_BASE.USER.BLOCKED_USERS_LIST_CONFIRMATION,
        await this.userService.getBlockedUsersList(caller),
      );
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.USER.BLOCKED_USERS_LIST_REQUEST)
  async blockedUsersList(
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const caller = await this.userService.getById(payload.userId);
    const blockedList = this.userService.getBlockedUsersList(caller);

    this.server
      .in(client.id)
      .emit(ROUTES_BASE.USER.BLOCKED_USERS_LIST_CONFIRMATION, blockedList);
  }
}
