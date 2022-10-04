import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard, UserPayload } from 'src/auth/jwt-ws.guard';
import { ChatService } from './chat.service';
import { UsersService } from 'src/user/user.service';
import { ROUTES_BASE } from 'shared/websocketRoutes/routes';
import CreateChannel from '../../shared/interfaces/CreateChannel';
import SearchChannel from '../../shared/interfaces/SearchChannel';
import { UserInterface } from 'shared/interfaces/UserInterface';

import * as bcrypt from 'bcrypt';
import ChannelData from 'shared/interfaces/ChannelData';
import Message from 'shared/interfaces/Message';
import ActionOnUser from 'shared/interfaces/ActionOnUser';
import UnattachFromChannel from 'shared/interfaces/UnattachFromChannel';
import RoomId from 'shared/interfaces/JoinChannel';
import MuteUser from 'shared/interfaces/MuteUser';
import { User } from 'src/user/user.entity';
import { Status } from 'shared/interfaces/UserStatus';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import { Privileges } from 'shared/interfaces/UserPrivilegesEnum';

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
export class ChatGateway implements OnGatewayConnection {
  private channelLobby = 'channelLobby';
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    // try { // this code is for DM notifications
    //   const user = await this.userService.getUserFromSocket(client);
    //   const userDM: Room[] = await this.chatService.getAllDMRoomsRaw(user);

    //   userDM.forEach((room) => {
    //     client.join(room.roomName);
    //   })
    // } catch (e) {
    //   console.error(e.message);
    // }
  }

  /* JOIN CHANNEL LOBBY */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_CHANNEL_LOBBY_REQUEST)
  async joinChannelLobby(@ConnectedSocket() client: Socket) {
    client.join(this.channelLobby);
    this.server
      .in(this.channelLobby)
      .emit(
        ROUTES_BASE.CHAT.LIST_ALL_CHANNELS,
        await this.chatService.getAllPublicRooms(),
      );
  }

  /**
   * JOIN ATTACHED CHANNELS LOBBY
   * SHOWS ONLY THE CHANNELS THE USER IS ATTACHED TO
   */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_ATTACHED_CHANNEL_LOBBY_REQUEST)
  async joinAttachedChannelLobby(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    client.emit(
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
    client
      .emit(
        ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS,
        await this.chatService.getAllDMRooms(payload.userId),
      );
  }

  @UseGuards(JwtWsGuard)
  async forceJoinDMChannelLobby(
    @ConnectedSocket() client: Socket,
    userId: number,
  ) {
    const DMList = await this.chatService.getAllDMRooms(userId);
    client
      .emit(
        ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS,
        DMList
      );
  }

  /* CREATE ROOM */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.CREATE_CHANNEL_REQUEST)
  async createRoom(
    @MessageBody() data: CreateChannel,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    if (data.channelName === '') {
      throw new WsException({
        error: 'You must input a channel name',
      });
    }
    /*  We first check if the channel name is already taken, if it is 
        we throw a Bad Request exception */
    const duplicateRoomCheck =
      await this.chatService.getRoomByNameWithRelations(data.channelName);

    if (duplicateRoomCheck) {
      throw new WsException({
        error: 'Channel name is already taken',
      });
    }
    /*  Then we check if the channel will be password protected, if it's not
        then the password will be an empty string, if it is we hash the 
        password */
    let hashedPassword = '';

    if (data.password !== '') hashedPassword = await crypt(data.password);

    /*  Then we create the room in the db and then enter the channel we 
        just created */
    const newRoom = await this.chatService.saveRoom({
      roomName: data.channelName,
      userId: payload.userId,
      isChannelPrivate: data.isChannelPrivate,
      password: hashedPassword,
    });

    this.server.in(client.id).emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, {
      channelId: newRoom.id,
      channelName: newRoom.channelName,
    });

    if (newRoom.isChannelPrivate === false) {
      this.server
        .in(this.channelLobby)
        .emit(ROUTES_BASE.CHAT.NEW_CHANNEL_CREATED, {
          channelId: newRoom.id,
          channelName: newRoom.channelName,
        });
    }
    this.attachUserToChannel(
      { channelName: newRoom.channelName, inputPassword: data.password },
      client,
      payload,
    );
  }

  /* CREATE DM ROOM*/
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.CREATE_DM)
  async createDM(
    @MessageBody() friendId: number,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const receiver = await this.userService.getById(friendId);
    if (!receiver) throw new WsException('User does not exist');

    const sender = await this.userService.getById(payload.userId);
    if (!sender) throw new WsException('User does not exist');

    const newDMRoom = await this.chatService.saveDMRoom(receiver, sender);

    await client.join(newDMRoom.roomName);

    const receiverSocketId = this.userService.getUserIdWebsocket(friendId);

    if (receiverSocketId) {
      /** Retrieve receiver's socket with the socket ID
       * https://stackoverflow.com/questions/67361211/socket-io-4-0-1-get-socket-by-id
       */

      const receiverSocket = this.server.sockets.sockets.get(
        receiverSocketId.socketId,
      );

      await receiverSocket.join(newDMRoom.roomName);
      this.forceJoinDMChannelLobby(receiverSocket, friendId);
    }

    client
      .emit(ROUTES_BASE.CHAT.CONFIRM_DM_CHANNEL_CREATION, {
        channelId: newDMRoom.id,
        channelName: newDMRoom.channelName,
      });
    this.joinDMChannelLobby(client, payload);
    client
      .emit(ROUTES_BASE.CHAT.MESSAGE_HISTORY, []);
  }

  /* ATTACH USER TO CHANNEL */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.ATTACH_TO_CHANNEL_REQUEST)
  async attachUserToChannel(
    @MessageBody() data: SearchChannel,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomWithRelations(
      { channelName: data.channelName },
      {
        members: true,
        messages: { author: true },
      },
    );
    if (!room) {
      throw new WsException({
        error: 'You must specify which channel you want to join',
      });
    }

    if (room.password !== '') {
      const isGoodPassword = await passwordCompare(
        data.inputPassword,
        room.password,
      );
      if (!isGoodPassword)
        throw new WsException({
          error:
            'A password has been set for this channel. Please enter the correct password.',
        });
    }
    await this.chatService.attachMemberToChannel(payload.userId, room);
    await this.joinAttachedChannelLobby(client, payload);
    await this.joinRoom({ roomId: room.id }, client, payload);
  }

  /** UNATTACH USER TO CHANNEL */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_REQUEST)
  async unattachUserToChannel(
    @MessageBody() { channelName }: UnattachFromChannel,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    let room = await this.chatService.getRoomWithRelations(
      { channelName },
      { admins: true, members: true, owner: true },
    );

    if (!room)
      return client.emit(ROUTES_BASE.ERROR, {
        message: 'You must specify which channel you want to leave',
      });

    room = await this.chatService.unattachMemberToChannel(payload.userId, room);
    client.leave(room.roomName);
    this.server.in(room.roomName).emit(
      ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_CONFIRMATION,
      payload.userId,
    );
    this.attachedUsersList(room.id);

    const ownerWebsocket: UsersWebsockets = UsersService.userWebsockets.find((user) => user.userId === room.owner.id)
    if (ownerWebsocket
      &&
      this.server.sockets.adapter.rooms
        .get(room.roomName)
        .has(ownerWebsocket.socketId)
    ) { // if owner is connected and is joined to this room
      this.server.sockets.sockets.get(ownerWebsocket.socketId).emit(
        ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION,
        { privilege: Privileges.OWNER },
      )
    }
  }

  /* JOIN ROOM */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST)
  async joinRoom(
    @MessageBody() { roomId }: RoomId,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomWithRelations(
      { id: roomId },
      {
        members: true,
        messages: { author: true },
        admins: true,
        owner: true,
      },
    );

    await client.join(room.roomName);

    const channelData: ChannelData = {
      channelId: room.id,
      channelName: room.channelName,
    };
    client.emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, channelData);

    client.emit(
      ROUTES_BASE.CHAT.MESSAGE_HISTORY,
      room.messages.map((message) => {
        const messageForFront: Message = {
          id: message.id,
          author: message.author.pongUsername,
          time: message.createdAt,
          content: message.content,
          roomId: room.id
        };
        return messageForFront;
      }),
    );

    this.server
      .in(room.roomName)
      .emit(
        ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION,
        await this.chatService.getAttachedUsersInChannel(roomId),
      );

    if (room.owner.id === payload.userId) {
      client.emit(
        ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION,
        { privilege: Privileges.OWNER },
      )
    }
  }

  /* DISCONNECT FROM CHANNEL */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.DISCONNECT_FROM_CHANNEL_REQUEST)
  async disconnectFromChannel(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.getRoomWithRelations({ id: roomId });
    await client.leave(room.roomName);
    client.emit(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, {
      channelId: room.id,
      channelName: room.channelName,
    });
  }

  /** GET ATTACHED USERS IN CHANNEL */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_REQUEST)
  async attachedUsersList(@MessageBody() roomId: number) {
    const room = await this.chatService.getRoomWithRelations({ id: roomId });

    this.server
      .in(room.roomName)
      .emit(
        ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION,
        await this.chatService.getAttachedUsersInChannel(roomId),
      );
  }

  /*MESSAGE LISTENER */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.SEND_MESSAGE)
  async messageListener(
    @MessageBody() data: { message: string; channelId: number },
    @UserPayload() payload: any,
  ) {
    if (data.message === '' || !data.channelId) return;
    const room = await this.chatService.getRoomWithRelations(
      { id: data.channelId },
      { messages: true },
    );
    const sender = await this.userService.getById(payload.userId);
    if (!sender) throw new WsException('User does not exist');

    const isUserMuted = await this.chatService.getMutedUser(sender, room);

    if (isUserMuted) {
      if (isUserMuted.unmuteAt > Date.now()) return;
      else this.chatService.unmuteUser(payload.userId, room.id);
    }

    const author = await this.userService.getUserByIdWithMessages(
      payload.userId,
    );
    if (!author) throw new WsException('Author does not exist');

    const newMessage = await this.chatService.saveMessage(
      data.message,
      author,
      room,
    );

    const messageForFront: Message = {
      id: newMessage.id,
      author: newMessage.author.pongUsername,
      time: newMessage.createdAt,
      content: newMessage.content,
      roomId: room.id,
    };

    if (room) {
      this.server
        .in(room.roomName)
        .emit(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, messageForFront);
    }
  }

  /** SET / UNSET ADMIN */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.SET_ADMIN_REQUEST)
  async setAdmin(
    @MessageBody() data: ActionOnUser,
    @UserPayload() payload: any,
  ) {
    if (data.userIdToUpdate === payload.userId)
      throw new WsException('You cannot update yourself');

    const newAdmin = await this.userService.getById(data.userIdToUpdate);
    if (!newAdmin) throw new WsException('User does not exist');

    const room = await this.chatService.getRoomWithRelations(
      { channelName: data.channelName },
      { owner: true, admins: true },
    );

    if (!room) throw new WsException('Channel does not exist');

    if (room.owner.id !== payload.userId)
      throw new WsException('You do not have the rights to set an admin');

    this.chatService.setAdmin(room, newAdmin);

    const promotedUser: UserInterface = {
      id: newAdmin.id,
      pongUsername: newAdmin.pongUsername,
      status: Status.ONLINE,
    };
    this.server
      .in(room.roomName)
      .emit(ROUTES_BASE.CHAT.SET_ADMIN_CONFIRMATION, promotedUser);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.UNSET_ADMIN_REQUEST)
  async unsetAdmin(
    @MessageBody() data: ActionOnUser,
    @UserPayload() payload: any,
  ) {
    if (data.userIdToUpdate === payload.userId)
      throw new WsException('You cannot change your own privileges');

    const oldAdmin = await this.userService.getById(data.userIdToUpdate);
    if (!oldAdmin) throw new WsException('User does not exist');

    const room = await this.chatService.getRoomWithRelations(
      { channelName: data.channelName },
      { owner: true, admins: true },
    );
    if (!room) throw new WsException('Channel does not exist');

    if (room.owner.id !== payload.userId)
      throw new WsException('You do not have the rights to unset an admin');

    this.chatService.unsetAdmin(room, oldAdmin);

    const demotedUser: UserInterface = {
      id: oldAdmin.id,
      pongUsername: oldAdmin.pongUsername,
      status: Status.ONLINE,
    };

    this.server
      .in(data.channelName)
      .emit(ROUTES_BASE.CHAT.UNSET_ADMIN_CONFIRMATION, demotedUser);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.USER_PRIVILEGES_REQUEST)
  async getUserPrivileges( // unused ?
    @MessageBody() data: RoomId,
    @UserPayload() payload: any,
  ) {
    const room = await this.chatService.getRoomWithRelations(
      { id: data.roomId },
      { owner: true, admins: true, members: true },
    );

    if (!room) throw new WsException('Channel does not exist');

    const privilege = this.chatService.getUserPrivileges(
      room,
      payload.userId,
    );

    this.server.emit(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, {
      privilege: privilege,
    });
  }

  /** BAN / KICK / MUTE */

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.BAN_USER_REQUEST)
  async banUser(
    @MessageBody() data: ActionOnUser,
    @UserPayload() payload: any,
  ) {
    const userToBan = await this.userService.getById(data.userIdToUpdate);
    if (!userToBan) throw new WsException('User does not exist');

    const room = await this.chatService.getRoomWithRelations(
      { channelName: data.channelName },
      { owner: true, admins: true, members: true },
    );

    if (!room) throw new WsException('Channel does not exist');

    if (
      payload.userId !== room.owner.id &&
      room.admins.filter((admin) => payload.userId === admin.id).length === 0
    )
      throw new WsException('You do not have the rights to ban a user');

    if (userToBan.id === room.owner.id)
      throw new WsException('An owner cannot be banned');

    /** The person who wants to ban is not an owner (so he's an admin) and wants to ban
     *  another user */
    if (
      payload.userId !== room.owner.id &&
      room.admins.filter((admin) => admin.id === userToBan.id).length !== 0
    )
      throw new WsException('Another admin cannot be banned');

    this.chatService.unattachMemberToChannel(userToBan.id, room);

    const bannedSocketId = this.chatService.getUserIdWebsocket(userToBan.id);

    if (bannedSocketId) {
      const bannedSocket = this.server.sockets.sockets.get(
        bannedSocketId.socketId,
      );
      this.disconnectFromChannel(room.id, bannedSocket);
    }
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.MUTE_USER_REQUEST)
  async muteUser(@MessageBody() data: MuteUser, @UserPayload() payload: any) {
    const userToMute = await this.userService.getById(data.userIdToMute);
    if (!userToMute) throw new WsException('User does not exist');

    const room = await this.chatService.getRoomWithRelations(
      { channelName: data.channelName },
      { owner: true, admins: true, members: true },
    );

    if (!room) throw new WsException('Channel does not exist');

    /** The person who wants to mute another user is not the owner or an admin */
    if (
      payload.userId !== room.owner.id &&
      room.admins.filter((admin) => payload.userId === admin.id).length === 0
    )
      throw new WsException('You do not have the rights to mute a user');

    /** The userToMute is the owner of the room */
    if (userToMute.id === room.owner.id)
      throw new WsException('An owner cannot be muted');

    /** The person who wants to mute is not an owner (so he's an admin) and wants to
     * mute another user */
    if (
      payload.userId !== room.owner.id &&
      room.admins.filter((admin) => admin.id === userToMute.id).length !== 0
    )
      throw new WsException('Another admin cannot be muted');

    await this.chatService.addMutedUser(userToMute, room, data.muteTime);
  }

  /** CHANGE PASSWORD */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.CHAT.CHANGE_PASSWORD_REQUEST)
  async changePassword(
    @MessageBody() { channelName, inputPassword }: SearchChannel,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const caller = await this.userService.getById(payload.userId);
    if (!caller) throw new WsException('User does not exist');

    const room = await this.chatService.getRoomWithRelations(
      { channelName: channelName },
      { owner: true },
    );

    if (!caller || !room)
      return this.server.in(client.id).emit(ROUTES_BASE.ERROR, {
        message: 'Room or User not found',
      });

    if (room.owner.id !== caller.id)
      return this.server.in(client.id).emit(ROUTES_BASE.ERROR, {
        message: 'You are not the owner of the channel',
      });

    let hashedPassword = '';
    if (inputPassword !== '') hashedPassword = await crypt(inputPassword);

    await this.chatService.changePassword(room, hashedPassword);

    this.server
      .in(client.id)
      .emit(ROUTES_BASE.CHAT.CHANGE_PASSWORD_CONFIRMATION);
  }
}
