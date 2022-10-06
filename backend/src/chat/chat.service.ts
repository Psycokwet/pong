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
import { Privileges } from 'shared/interfaces/UserPrivilegesEnum';
import { v4 as uuidv4 } from 'uuid';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import ChannelData from 'shared/interfaces/ChannelData';
import { Muted } from './muted.entity';
import { Banned } from './banned.entity';
import { validate } from 'class-validator';
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
    @InjectRepository(Banned)
    private bannedRepository: Repository<Banned>,
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
            currentUserPrivileges: Privileges.MEMBER,
          };
        }),
      );
  }

  public async getAllAttachedRooms(userId: number) {
    const user = await this.userService.getById(userId);
    if (!user) throw new WsException('User does not exist');

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

  public async getAllDMRoomsRaw(user: User): Promise<Room[]> {
    return await this.roomsRepository.find({
      where: {
        members: {
          id: user.id,
        },
        isDM: true,
      },
    });
  }

  public async getAllDMRooms(userId: number) {
    const user = await this.userService.getById(userId);
    if (!user) throw new WsException('User does not exist');

    const rooms: Room[] = await this.roomsRepository.find({
      where: {
        members: {
          id: userId,
        },
        isDM: true,
      },
    });

    const result: ChannelData[] = [];
    for (let i = 0; i < rooms.length; i++) {
      const room = await this.roomsRepository.findOne({
        relations: {
          members: true,
        },
        where: { id: rooms[i].id },
      });
      result[i] = {
        channelId: room.id,
        channelName: room.members.filter((user) => user.id !== userId)[0]
          .pongUsername,
      };
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

  public async getBannedUser(sender: User, room: Room) {
    return await this.bannedRepository.findOne({
      where: { bannedUserId: sender.id, roomId: room.id },
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
    if (!user) throw new WsException('User does not exist');

    let channelNameValidate = new Room();
    channelNameValidate.channelName = roomName;

    const errors = await validate(channelNameValidate);
    if (errors.length > 0)
      throw new WsException({
        message: errors.map((error) => error.constraints),
      });

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

  async saveDMRoom(receiver: User, sender: User) {
    if (receiver.id === sender.id) {
      throw new WsException({
        error: "You're trying to send a DM to yourself",
      });
    }

    const roomName = 'DM_' + uuidv4();

    /** Making sure a DM channel between the receiver and the sender does not already exist, throws
     * a Bad Request if there is
     */
    await this.doesDMChannelExist(receiver.id, sender.id);

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
      throw new WsException({
        error: 'DM already exists',
      });
    }
  }

  async attachMemberToChannel(userId: number, room: Room) {
    const newMember = await this.userService.getById(userId);
    if (!newMember) throw new WsException('User does not exist');

    if (
      !room.members.filter(
        (member: User) => member.login42 === newMember.login42,
      ).length
    )
      room.members = [...room.members, newMember];

    await room.save();
  }

  async unattachMemberToChannel(userId: number, room: Room) {
    room.members = room.members.filter((member: User) => member.id !== userId);

    room.admins = room.admins.filter((admin: User) => admin.id !== userId);

    if (room.owner.id === userId) {
      let newOwner: User = room.admins.length
        ? room.admins.find((admin) => admin.id !== userId)
        : undefined;
      if (!newOwner)
        newOwner = room.members.length
          ? room.members.find((member) => member.id !== userId)
          : undefined;
      if (newOwner) {
        room.owner = newOwner;
        const isNewOwnerAdmin = room.admins.find(
          (admin) => room.owner.id === admin.id,
        );
        if (!isNewOwnerAdmin) room.admins = [...room.admins, newOwner];
      }
    }

    if (room.members.length === 0) await room.remove();
    else await room.save();
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

  async addBannedUser(bannedUser: User, room: Room, banTime: number) {
    const addBanned = Banned.create({
      roomId: room.id,
      bannedUserId: bannedUser.id,
      unbanAt: Date.now() + banTime,
    });

    await addBanned.save();
  }

  async unbanUser(userIdToUnban: number, roomId: number) {
    return await Banned.delete({
      bannedUserId: userIdToUnban,
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
      { members: true, owner: true, admins: true },
    );

    if (!room) {
      throw new WsException('Channel does not exist');
    }

    const userInterfaceMembers = room.members.map((member) => ({
      id: member.id,
      pongUsername: member.pongUsername,
      status: this.userService.getStatus(member),
      privileges: this.getUserPrivileges(room, member.id),
    }));

    return userInterfaceMembers;
  }

  getUserPrivileges(room: Room, userId: number): Privileges {
    if (room.isDM === true) return Privileges.MEMBER;

    if (userId === room.owner.id) return Privileges.OWNER;

    if (room.admins.find((admin) => admin.id === userId)) {
      return Privileges.ADMIN;
    }

    return Privileges.MEMBER;
  }

  async changePassword(room: Room, newPassword: string) {
    room.password = newPassword;

    await room.save();
  }
}
