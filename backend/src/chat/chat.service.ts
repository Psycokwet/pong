import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import Room from './room.entity';
import { UsersService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoom } from 'shared/interfaces/ChatRoom';
@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UsersService,
  ) {}
  private static chatRoomList: ChatRoom[] = [];

  public async getAllRooms() {
    return this.roomsRepository.find().then((rooms) =>
      rooms.map((room) => {
        return {
          channelId: room.id,
          channelName: room.channelName,
        };
      }),
    );
  }

  public async getRoomsById(
    where: FindOptionsWhere<Room>,
    relations?: FindOptionsRelations<Room>,
  ) {
    return this.roomsRepository.findOne({
      where: where,
      relations: relations,
    });
  }

  async saveRoom(roomName: string, userId: number) {
    const user = await this.userService.getById(userId);

    const newRoom = await Room.create({
      roomName: `channel:${roomName}:${uuidv4()}`,
      channelName: roomName,
      owner: user,
      members: [user],
      isDM: false,
    });

    await newRoom.save();
    return newRoom;
  }

  async saveDMRoom(receiverId: number, senderId: number) {
    const receiver = await this.userService.getById(receiverId);
    const sender = await this.userService.getById(senderId);
    const roomName = 'DM_' + uuidv4();

    /** Making sure a DM channel between the receiver and the sender does not already exist, throws
     * a Bad Request if there is
     */
    await this.doesDMChannelExist(receiverId, senderId);

    const newRoom = await Room.create({
      roomName: `channel:${roomName}:${uuidv4()}`,
      channelName: uuidv4(),
      isDM: true,
      members: [sender, receiver],
    });

    console.log('newRoom', newRoom);

    await newRoom.save();
    return newRoom;
  }

  async doesDMChannelExist(receiverId: number, senderId: number) {
    const senderDMs = await this.roomsRepository.find({
      relations: {
        members: true,
      },
      where: {
        isDM: true,
        members: [{ id: senderId }, { id: receiverId }],
      },
    });

    console.log('senderDMs', senderDMs);

    const DMExists = await senderDMs.filter((room) => {
      return room.members.length === 2;
    }).length;

    console.log('DMExists', DMExists);

    if (DMExists !== 0) {
      console.log('DM already exists');
      throw new BadRequestException({
        error: 'DM already exists',
      });
    } else return false;
  }

  async addMemberToChannel(userId: number, room: Room) {
    const newMember = await this.userService.getById(userId);
    if (
      !room.members.filter(
        (member: User) => member.login42 === newMember.login42,
      ).length
    )
      room.members = [...room.members, newMember];

    room.save();
  }

  async saveMessage(content: string, author: User, channel: Room) {
    const newMessage = await this.messagesRepository.create({
      content: content,
      author: author,
      room: channel,
    });
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return this.messagesRepository.find({
      relations: ['author'],
    });
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  /** ChatRoomConnectedUsers methods */
  updateUserConnectedToRooms(roomName: string, userId): number[] {
    let chatRoomIndex = ChatService.chatRoomList.findIndex(
      (chatRoom) => chatRoom.roomName === roomName,
    );
    if (chatRoomIndex === -1) {
      const newChatRoom = new ChatRoom();
      newChatRoom.roomName = roomName;
      newChatRoom.userIdList = [userId];

      ChatService.chatRoomList = [...ChatService.chatRoomList, newChatRoom];
      chatRoomIndex = ChatService.chatRoomList.findIndex(
        (chatRoom) => chatRoom.roomName === roomName,
      );
    } else if (
      !ChatService.chatRoomList[chatRoomIndex].userIdList.includes(userId)
    ) {
      ChatService.chatRoomList[chatRoomIndex].userIdList = [
        ...ChatService.chatRoomList[chatRoomIndex].userIdList,
        userId,
      ];
    }
    return ChatService.chatRoomList[chatRoomIndex].userIdList;
  }

  removeUserConnectedToRooms(roomName: string, userId): number[] {
    const chatRoomIndex = ChatService.chatRoomList.findIndex(
      (chatRoom) => chatRoom.roomName == roomName,
    );
    if (ChatService.chatRoomList[chatRoomIndex].userIdList.includes(userId)) {
      ChatService.chatRoomList[chatRoomIndex].userIdList =
        ChatService.chatRoomList[chatRoomIndex].userIdList.filter(
          (id) => id !== userId,
        );
    }
    return ChatService.chatRoomList[chatRoomIndex].userIdList;
  }
  /** END ChatRoomConnectedUsers methods */
}
