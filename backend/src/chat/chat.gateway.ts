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
@WebSocketGateway({
  // namespace: '/chat',
  transport: ['websocket'],
  cors: '*/*',
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinChannelLobby')
  async joinChannelLobby(@ConnectedSocket() client: Socket) {
    console.log(await this.chatService.getAllRooms());
    // return await this.chatService.getAllRooms();
    client.join('channelLobby');
    this.server
      .in('channelLobby')
      .emit('allChannel', await this.chatService.getAllRooms());
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('createRoom')
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

    console.log(newRoom.id);

    this.server.in('channelLobby').emit('createdRoom', {
      channelId: newRoom.id,
      channelName: newRoom.channelName,
    });
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomById(roomId);
    console.log(payload);
    client.join(room.roomName);
    await this.chatService.addMemberToChannel(payload.userId, room);
    this.server.in(client.id).emit('joinedRoom', {
      channelId: room.id,
      channelName: room.channelName,
    });
    // create channel named data
    // client.join(data);
    // console.log(data, client, client.id, this.server, this.server.id);
    // client.join(`${data}${client.id}`);
    // client.join('test');
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('disconnectFromChannel')
  async disconnectFromChannel(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.getRoomById(roomId);
    client.leave(room.roomName);
    this.server.in(client.id).emit('disconnectedFromChannel', {
      channelId: room.id,
      channelName: room.channelName,
    });
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() data: { message: string; channelId: number },
  ) {
    const room = await this.chatService.getRoomById(data.channelId);
    if (room)
      this.server.in(room.roomName).emit('receive_message', data.message);
  }
}
