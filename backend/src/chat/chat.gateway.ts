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
  joinChannelLobby(@ConnectedSocket() client: Socket) {
    
  }
  
  @UseGuards(JwtWsGuard)
  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket, @UserPayload() payload: any) {
    const newRoom = this.chatService.saveRoom(roomName, client.id, payload.userId)
    .then((room) => {
      client.join(room.roomName)
      return room;
    })
    .then(
      room => this.server.in(room.roomName)
        .emit('createdRoom', room.id)
    )
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    // create channel named data
    // client.join(data);
    // console.log(data, client, client.id, this.server, this.server.id);
    // client.join(`${data}${client.id}`);
    client.join('test');
  }

  // @SubscribeMessage('send_message')
  // listenForMessages(@MessageBody() data: string) {
  //   console.log("CC BOB");
  //   this.server.in('test').emit('receive_message', data);
  // }
}
