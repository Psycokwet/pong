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
import { ChatRoom } from 'shared/interfaces/ChatRoom';
@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  private static chatRoomList: ChatRoom[] = [];

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
    
    const newChatRoom = new ChatRoom();
    newChatRoom.roomName = newRoom.roomName;
    newChatRoom.userIdList = [payload.userId];
    
    ChatGateway.chatRoomList = [...ChatGateway.chatRoomList, newChatRoom];
    this.server.in(newRoom.roomName).emit('updateConnectedUsers', newChatRoom.userIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinChannelRequest')
  async joinRoom(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomById(roomId);
    client.join(room.roomName);
    await this.chatService.addMemberToChannel(payload.userId, room);
    this.server.in(client.id).emit('confirmChannelEntry', {
      channelId: room.id,
      channelName: room.channelName,
    });

    let chatRoomIndex = ChatGateway.chatRoomList.findIndex((chatRoom) => chatRoom.roomName == room.roomName);
    if (chatRoomIndex === -1) {
      const newChatRoom = new ChatRoom();
      newChatRoom.roomName = room.roomName;
      newChatRoom.userIdList = [payload.userId];
      
      ChatGateway.chatRoomList = [...ChatGateway.chatRoomList, newChatRoom];
      chatRoomIndex = ChatGateway.chatRoomList.findIndex((chatRoom) => chatRoom.roomName == room.roomName);
    }
    else if (!ChatGateway.chatRoomList[chatRoomIndex].userIdList.includes(payload.userId)) {
      ChatGateway.chatRoomList[chatRoomIndex].userIdList = [
        ...ChatGateway.chatRoomList[chatRoomIndex].userIdList,
        payload.userId
      ];
    }
    this.server.in(room.roomName).emit('updateConnectedUsers', ChatGateway.chatRoomList[chatRoomIndex].userIdList);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('disconnectFromChannelRequest')
  async disconnectFromChannel(
    @MessageBody() roomId: number,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.getRoomById(roomId);
    client.leave(room.roomName);
    this.server.in(client.id).emit('confirmChannelDisconnection', {
      channelId: room.id,
      channelName: room.channelName,
    });

    const chatRoomIndex = ChatGateway.chatRoomList.findIndex((chatRoom) => chatRoom.roomName == room.roomName);
    if (ChatGateway.chatRoomList[chatRoomIndex].userIdList.includes(payload.userId))
    {
      ChatGateway.chatRoomList[chatRoomIndex].userIdList = 
        ChatGateway
          .chatRoomList[chatRoomIndex]
          .userIdList
          .filter((id) => id !== payload.userId);
    }
    this.server.in(room.roomName).emit(
      'updateConnectedUsers',
      ChatGateway.chatRoomList[chatRoomIndex].userIdList
    );
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('sendMessage')
  async messageListener(
    @MessageBody() data: { message: string; channelId: number },
  ) {
    const room = await this.chatService.getRoomById(data.channelId);
    if (room)
      this.server.in(room.roomName).emit('receiveMessage', data.message);
  }
}
