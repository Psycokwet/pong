import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard, UserPayload } from 'src/auth/jwt-ws.guard';
import { ChatService } from './chat.service';

import { ROUTES_BASE } from 'shared/websocketRoutes/routes';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class ChatGateway {
  private channelLobby = 'channelLobby';
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  /** JOIN LOBBY -- ALL USERS CAN FREELY ENTER THESE LOBBIES */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_CHANNEL_LOBBY_REQUEST)
  async joinChannelLobby(@ConnectedSocket() client: Socket) {
    client.join(this.channelLobby);
    this.server
      .in(this.channelLobby)
      .emit(
        ROUTES_BASE.CHAT.LIST_ALL_CHANNELS,
        await this.chatService.getAllRooms(),
      );
  }

  /** JOIN ATTACHED CHANNELS LOBBY -- SHOWS ONLY THE CHANNELS THE USER
   * IS ATTACHED TO
   */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_ATTACHED_CHANNEL_LOBBY_REQUEST)
  async joinAttachedChannelLobby(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    this.server
      .in(client.id)
      .emit(
        ROUTES_BASE.CHAT.LIST_ALL_ATTACHED_CHANNELS,
        await this.chatService.getAllAttachedRooms(payload.userId),
      );
  }

  /** JOIN DM CHANNELS LOBBY -- SHOWS ONLY THE DMs THE CURRENT USER HAS */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_DM_CHANNEL_LOBBY_REQUEST)
  async joinDMChannelLobby(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    this.server
      .in(client.id)
      .emit(
        ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS,
        await this.chatService.getAllDMRooms(payload.userId),
      );
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.CREATE_CHANNEL_REQUEST)
  async createRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    if (roomName === '') return;

    const newRoom = await this.chatService.saveRoom(roomName, payload.userId);

    await client.join(newRoom.roomName);

    // this.server.in(this.channelLobby).emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, {
    this.server.in(client.id).emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, {
      channelId: newRoom.id,
      channelName: newRoom.channelName,
    });
    this.server.in('channelLobby').emit(ROUTES_BASE.CHAT.NEW_CHANNEL_CREATED, {
      channelId: newRoom.id,
      channelName: newRoom.channelName,
    });

    const connectedUserIdList: number[] =
      this.chatService.updateUserConnectedToRooms(
        newRoom.roomName,
        payload.userId,
      );
    this.server
      .in(newRoom.roomName)
      .emit(ROUTES_BASE.CHAT.UPDATE_CONNECTED_USERS, connectedUserIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_CHANNE_REQUEST)
  async joinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomsById(roomId, {
      members: true,
      messages: {
        author: true,
      },
    });
    client.join(room.roomName);
    await this.chatService.addMemberToChannel(payload.userId, room);
    this.server.in(client.id).emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, {
      channelId: room.id,
      channelName: room.channelName,
    });

    this.server.in(client.id).emit(
      'messageHistory',
      room.messages.map((message) => {
        return {
          id: message.id,
          author: this.userService.getFrontUsername(message.author),
          time: message.createdAt,
          content: message.content,
        };
      }),
    );
    const connectedUserIdList: number[] =
      this.chatService.updateUserConnectedToRooms(
        room.roomName,
        payload.userId,
      );
    this.server
      .in(room.roomName)
      .emit(ROUTES_BASE.CHAT.UPDATE_CONNECTED_USERS, connectedUserIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.GET_CONNECTED_USER_LIST_REQUEST)
  async getUsersInChannel(
    @MessageBody() roomId: number,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomsById(roomId, {
      members: true,
    });

    this.server.in(room.roomName).emit(
      ROUTES_BASE.CHAT.CONNECTED_USER_LIST,
      room.members.map((user) => {
        return {
          id: user.id,
          pongUsername: this.userService.getFrontUsername(user),
        };
      }),
    );
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.DISCONNECT_FROM_CHANNEL_REQUEST)
  async disconnectFromChannel(
    @MessageBody() roomId: number,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.getRoomsById(roomId);
    client.leave(room.roomName);
    this.server
      .in(client.id)
      .emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, {
        channelId: room.id,
        channelName: room.channelName,
      });

    const connectedUserIdList: number[] =
      this.chatService.removeUserConnectedToRooms(
        room.roomName,
        payload.userId,
      );
    this.server
      .in(room.roomName)
      .emit(ROUTES_BASE.CHAT.UPDATE_CONNECTED_USERS, connectedUserIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.SEND_MESSAGE)
  async messageListener(
    @MessageBody() data: { message: string; channelId: number },
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomsById(data.channelId, {
      messages: true,
    });
    const author = await this.userService.getUserByIdWithMessages(
      payload.userId,
    );

    const newMessage = await this.chatService.saveMessage(
      data.message,
      author,
      room,
    );

    if (room)
      this.server.in(room.roomName).emit(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, {
        id: newMessage.id,
        author: this.userService.getFrontUsername(newMessage.author),
        time: newMessage.createdAt,
        content: newMessage.content,
      });
  }
}
