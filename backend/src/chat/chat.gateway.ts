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
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinChannelLobbyRequest')
  async joinChannelLobby(@ConnectedSocket() client: Socket) {
    client.join('channelLobby');
    this.server
      .in('channelLobby')
      .emit('listAllChannels', await this.chatService.getAllRooms());
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('createChannelRequest')
  async createRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const newRoom = await this.chatService.saveRoom(
      roomName,
      client.id,
      payload.userId,
    );

    await client.join(newRoom.roomName);

    this.server.in('channelLobby').emit('confirmChannelCreation', {
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
      .emit('updateConnectedUsers', connectedUserIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinChannelRequest')
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
    this.server.in(client.id).emit('confirmChannelEntry', {
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
      .emit('updateConnectedUsers', connectedUserIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('getConnectedUserListRequest')
  async getUsersInChannel(
    @MessageBody() roomId: number,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomsById(roomId, {
      members: true,
    });

    this.server.in(room.roomName).emit(
      'connectedUserList',
      room.members.map((user) => {
        return {
          id: user.id,
          pongUsername: this.userService.getFrontUsername(user),
        };
      }),
    );
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('disconnectFromChannelRequest')
  async disconnectFromChannel(
    @MessageBody() roomId: number,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.getRoomsById(roomId);
    client.leave(room.roomName);
    this.server.in(client.id).emit('confirmChannelDisconnection', {
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
      .emit('updateConnectedUsers', connectedUserIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('sendMessage')
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
      this.server.in(room.roomName).emit('receiveMessage', {
        id: newMessage.id,
        author: this.userService.getFrontUsername(newMessage.author),
        time: newMessage.createdAt,
        content: newMessage.content,
      });
  }
}
