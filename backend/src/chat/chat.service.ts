import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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
import { Privileges } from 'shared/interfaces/UserPrivileges';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoom } from 'shared/interfaces/ChatRoom';
import ChannelData from 'shared/interfaces/ChannelData';
import ActionOnUser from 'shared/interfaces/ActionOnUser';
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

  public async getAllPublicRooms(): Promise<ChannelData[]> {
    return this.roomsRepository
      .find({
        where: { isChannelPrivate: false },
      })
      .then((rooms) =>
        rooms.map((room) => {
          return {
            channelId: room.id,
            channelName: room.channelName,
          };
        }),
      );
  }

  public async getAllAttachedRooms(userId: number) {
    const user = await this.userService.getById(userId);

    return this.roomsRepository
      .find({
        relations: {
          members: true,
        },
        where: {
          members: {
            id: user.id,
          },
        },
      })
      .then((rooms) =>
        rooms.map((room) => {
          return {
            channelId: room.id,
            channelName: room.channelName,
          };
        }),
      );
  }

  public async getAllDMRooms(userId: number) {
    const user = await this.userService.getById(userId);

    return this.roomsRepository
      .find({
        relations: {
          members: true,
        },
        where: {
          members: {
            id: user.id,
          },
          isDM: true,
        },
      })
      .then((rooms) =>
        rooms.map((room) => {
          return {
            id: room.id,
            targetName: room.members.find((target) => target.id !== user.id),
          };
        }),
      );
  }

  public async getRoomById(id: number) {
    return this.roomsRepository.findOneBy({ id });
  }

  public async getRoomWithRelations(
    where: FindOptionsWhere<Room>,
    relations?: FindOptionsRelations<Room>,
  ): Promise<Room | undefined> {
    return this.roomsRepository.findOne({
      where: where,
      relations: relations,
    });
  }

  public async getRoomByName(roomName: string) {
    return this.roomsRepository.findOneBy({ roomName: roomName });
  }

  public async getRoomByNameWithRelations(roomName: string) {
    return this.roomsRepository.findOne({
      where: { channelName: roomName },
      relations: {
        members: true,
      },
    });
  }

  async saveRoom({
    roomName,
    userId,
    isChannelPrivate,
    password,
  }: {
    roomName: string;
    userId: number;
    isChannelPrivate: boolean;
    password: string;
  }) {
    const user = await this.userService.getById(userId);

    const newRoom = await Room.create({
      roomName: `channel:${roomName}:${uuidv4()}`,
      channelName: roomName,
      password: password,
      owner: user,
      members: [user],
      isDM: false,
      isChannelPrivate: isChannelPrivate,
      admins: [user],
    });

    await newRoom.save();
    return newRoom;
  }

  async saveDMRoom(receiverId: number, senderId: number) {
    if (receiverId === senderId) {
      throw new BadRequestException({
        error: "You're trying to send a DM to yourself",
      });
    }
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

    await newRoom.save();
    return newRoom;
  }

  private async doesDMChannelExist(receiverId: number, senderId: number) {
    const senderDMs = await this.roomsRepository.find({
      relations: {
        members: true,
      },
      where: {
        isDM: true,
        members: [{ id: senderId }, { id: receiverId }],
      },
    });

    const DMExists = await senderDMs.filter((room) => {
      return (
        room.members.find((user) => user.id === receiverId) &&
        room.members.find((user) => user.id === senderId)
      );
    });

    if (DMExists.length !== 0) {
      throw new BadRequestException({
        error: 'DM already exists',
      });
    }
  }

  async attachMemberToChannel(userId: number, room: Room) {
    const newMember = await this.userService.getById(userId);

    if (
      !room.members.filter(
        (member: User) => member.login42 === newMember.login42,
      ).length
    )
      room.members = [...room.members, newMember];

    await room.save();
  }

  async unattachMemberToChannel(userId: number, room: Room) {
    const leavingUser = await this.userService.getById(userId);

    room.members = room.members.filter(
      (member: User) => member.login42 !== leavingUser.login42,
    );

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

  //Unused fct
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

  async setAdmin(userId: number, data: ActionOnUser) {
    const room = await this.getRoomWithRelations(
      { channelName: data.channelName },
      { owner: true, admins: true },
    );
    console.log('room', room);
    console.log('userId', userId);
    const verifyOwner = await this.userService.getById(userId);
    const futureAdmin = await this.userService.getById(data.userId);
    console.log('verifyOwner', verifyOwner);
    console.log('room.owner', room.owner);
    console.log('futureAdmin', futureAdmin);
    if (!room) {
      throw new BadRequestException('Channel does not exist');
    }

    if (!verifyOwner) {
      throw new BadRequestException('Owner not found');
    }

    if (room.owner.id !== verifyOwner.id) {
      throw new ForbiddenException(
        'You do not have the rights to set an admin',
      );
    }

    if (room.owner.id === futureAdmin.id) {
      throw new BadRequestException('You are already an admin');
    }

    room.admins = [...room.admins, futureAdmin];

    await room.save();
  }

  async unsetAdmin(userId: number, data: ActionOnUser) {
    const room = await this.getRoomWithRelations(
      { channelName: data.channelName },
      { owner: true, admins: true },
    );

    console.log('room', room);
    console.log('userId', userId);

    const verifyOwner = await this.userService.getById(userId);
    const firedAdmin = await this.userService.getById(data.userId);

    console.log('verifyOwner', verifyOwner);
    console.log('room.owner', room.owner);
    console.log('firedAdmin', firedAdmin);

    if (!room) {
      throw new BadRequestException('Channel does not exist');
    }

    if (!verifyOwner) {
      throw new BadRequestException('Owner not found');
    }

    if (room.owner.id !== verifyOwner.id) {
      throw new ForbiddenException(
        'You do not have the rights to set an admin',
      );
    }

    if (room.owner.id === firedAdmin.id) {
      throw new BadRequestException('An owner has to be an admin');
    }

    room.admins = room.admins.filter(
      (admin: User) => firedAdmin.id !== admin.id,
    );

    await room.save();
  }

  async getAttachedUsersInChannel(roomId: number) {
    const room = await this.getRoomWithRelations(
      { id: roomId },
      { members: true },
    );

    if (!room) {
      throw new BadRequestException('Channel does not exist');
    }

    console.log(room.members);
    return room.members;
  }

  async getUserPrivileges(roomId: number, userId: number) {
    const room = await this.getRoomWithRelations(
      { id: roomId },
      { owner: true, admins: true, members: true },
    );

    if (userId === room.owner.id) return { privilege: Privileges.OWNER };

    if (room.admins.filter((admin) => admin.id === userId).length) {
      return { privilege: Privileges.ADMIN };
    }

    return { privilege: Privileges.MEMBER };
  }
}
