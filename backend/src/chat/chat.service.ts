import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Server, Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import {
  FindOptionsRelations,
  FindOptionsUtils,
  FindOptionsWhere,
  RelationQueryBuilder,
  Repository,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import Room from './room.entity';
import { UsersService } from 'src/user/user.service';
import { Privileges } from 'shared/interfaces/UserPrivilegesEnum';
import { v4 as uuidv4 } from 'uuid';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import ChannelData from 'shared/interfaces/ChannelData';
import ActionOnUser from 'shared/interfaces/ActionOnUser';
import { Muted } from './muted.entity';
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
    @InjectRepository(Muted)
    private mutedRepository: Repository<Muted>,
    private userService: UsersService,
  ) {}
  public static userWebsockets: UsersWebsockets[] = [];

  public async getAllPublicRooms(): Promise<ChannelData[]> {
    return this.roomsRepository
      .find({
        where: {
          isChannelPrivate: false,
          isDM: false,
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

  public async getAllAttachedRooms(userId: number) {
    const user = await this.userService.getById(userId);

    const attachedRoomList = await this.roomsRepository
      .find({
        relations: {
          members: true,
        },
        where: {
          members: {
            id: user.id,
          },
          isDM: false,
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
    return attachedRoomList;
  }

  public async getAllDMRooms(userId: number) {
    const user = await this.userService.getById(userId);

    const rooms: Room[] = await this.roomsRepository
      .find({
        where: {
          members: {
            id: user.id,
          },
          isDM: true,
        },
      });

      const result = [];
      for (let i = 0; i < rooms.length; i++) {
        const room = await this.roomsRepository.findOne({
          relations: {
            members: true,
          },
          where: { id: rooms[i].id }
        })
        result[i] = {
            channelId: room.id,
            channelName: room.members.filter((user) => user.id !== userId)[0].pongUsername
        }
      }
      return result;
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

  public async getMutedUser(sender: User, room: Room) {
    return await this.mutedRepository.findOne({
      where: { mutedUserId: sender.id, roomId: room.id },
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

    const newRoom = Room.create({
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

    const newRoom = Room.create({
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

    const DMExists = senderDMs.filter((room) => {
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

  async addMutedUser(mutedUser: User, room: Room, muteTime: number) {
    const addMuted = Muted.create({
      roomId: room.id,
      mutedUserId: mutedUser.id,
      unmuteAt: Date.now() + muteTime,
    });

    await addMuted.save();
  }

  async unmuteUser(userIdToUnmute: number, roomId: number) {
    return await Muted.delete({
      mutedUserId: userIdToUnmute,
      roomId: roomId,
    });
  }

  async saveMessage(content: string, author: User, channel: Room) {
    const newMessage = this.messagesRepository.create({
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
    if (cookie) {
      const { Authentication: authenticationToken } = parse(cookie);
      const user = await this.authService.getUserFromAuthenticationToken(
        authenticationToken,
      );
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      return user;
    }
  }

  getUserIdWebsocket(receiverId: number): UsersWebsockets | undefined {
    return ChatService.userWebsockets.find(
      (receiver) => receiver.userId === receiverId,
    );
  }
  /** END ChatRoomConnectedUsers methods */

  async setAdmin(room: Room, newAdmin: User) {
    room.admins = [...room.admins, newAdmin];

    await room.save();
  }

  async unsetAdmin(room: Room, oldAdmin: User) {
    room.admins = room.admins.filter((admin: User) => oldAdmin.id !== admin.id);

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

    const userInterfaceMembers = room.members.map((member) => ({
      id: member.id,
      pongUsername: member.pongUsername,
      status: this.userService.getStatus(member),
    }));

    return userInterfaceMembers;
  }

  getUserPrivileges(room: Room, userId: number): { privilege: Privileges } {
    if (room.isDM === true) return { privilege: Privileges.MEMBER };

    if (userId === room.owner.id) return { privilege: Privileges.OWNER };

    if (room.admins.filter((admin) => admin.id === userId).length) {
      return { privilege: Privileges.ADMIN };
    }

    return { privilege: Privileges.MEMBER };
  }

  async changePassword(room: Room, newPassword: string) {
    room.password = newPassword;

    await room.save();
  }
}
