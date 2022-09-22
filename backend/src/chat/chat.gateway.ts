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
import * as bcrypt from 'bcrypt';

async function crypt(password: string): Promise<string> {
  return bcrypt.genSalt(10).then((s) => bcrypt.hash(password, s));
}

async function passwordCompare(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('joinChannelLobbyRequest')
  async joinChannelLobby(@ConnectedSocket() client: Socket) {
    client.join('channelLobby');
    this.server
      .in('channelLobby')
      .emit('listAllChannels', await this.chatService.getAllPublicRooms());
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('createChannelRequest')
  async createRoom(
    @MessageBody()
    createChannelRequestData: {
      roomName: string;
      isChannelPrivate: boolean;
      password: string;
    },
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const hashedPassword = await crypt(createChannelRequestData.password);
    const newRoom = await this.chatService.saveRoom(
      createChannelRequestData.roomName,
      client.id,
      payload.userId,
      createChannelRequestData.isChannelPrivate,
      hashedPassword,
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
    @MessageBody()
    joinChannelRequestData: { roomId: number; userPassword: string },
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    //WARNING: si on fait comme ca, on doit toujours demander un password
    //a l'utilisateur
    const room = await this.chatService.getRoomByIdWithRelations(
      joinChannelRequestData.roomId,
    );
    if (room.password !== '') {
      const isGoodPassword = passwordCompare(
        joinChannelRequestData.userPassword,
        room.password,
      );
      if (!isGoodPassword) return;
    }
    client.join(room.roomName);
    await this.chatService.addMemberToChannel(payload.userId, room);
    this.server.in(client.id).emit('confirmChannelEntry', {
      channelId: room.id,
      channelName: room.channelName,
    });

    const connectedUserIdList: number[] =
      this.chatService.updateUserConnectedToRooms(
        room.roomName,
        payload.userId,
      );
    this.server
      .in(room.roomName)
      .emit('updateConnectedUsers', connectedUserIdList);
  }

  //joinPrivateChannelRequest

  @UseGuards(JwtWsGuard)
  @SubscribeMessage('getConnectedUserListRequest')
  async getUsersInChannel(
    @MessageBody() roomId: number,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomByIdWithRelations(roomId);
    const caller = await this.userService.getById(payload.userId);

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
    const room = await this.chatService.getRoomById(roomId);
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
  ) {
    const room = await this.chatService.getRoomById(data.channelId);
    if (room)
      this.server.in(room.roomName).emit('receiveMessage', data.message);
  }
}
