import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  // namespace: '/chat',
  transport: ['websocket'],
  cors: '*/*',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    console.log("CC BOB");
    // console.log(data);
    // console.log(this.server.sockets)
    // this.server.sockets.emit('receive_message', data);
    this.server.emit('receive_message', data);
  }
}
