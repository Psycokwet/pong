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

  @SubscribeMessage('joinChannelLobby')
  async joinChannelLobby(@ConnectedSocket() client: Socket) {
    console.log(await this.chatService.getAllRooms())
    // return await this.chatService.getAllRooms();
    client.join('channelLobby');
    this.server.in('channelLobby').emit('allChannel', await this.chatService.getAllRooms());
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

    this.server.emit('createdRoom', { channelId: newRoom.id, channelName: newRoom.channelName });
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    // create channel named data
    // client.join(data);
    // console.log(data, client, client.id, this.server, this.server.id);
    // client.join(`${data}${client.id}`);
    client.join('test');
  }

  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() data: {
    message: string;
    channelId: number;
  }) {
    const room = await this.chatService.getRoomById(data.channelId)
    if (room)
      this.server.in(room.roomName).emit('receive_message', data.message);
  }
}