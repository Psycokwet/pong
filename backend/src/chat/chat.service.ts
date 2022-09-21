import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import Room from './room.entity';
import { UsersService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

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

  public async getRoomsById(id: number, options?: FindOptionsRelations<Room>) {
    return this.roomsRepository.findOne({
      where: { id },
      relations: options,
    });
  }

  async saveRoom(roomName: string, clientId: string, userId: number) {
    const user = await this.userService.getById(userId);

    const newRoom = await Room.create({
      roomName: `channel:${roomName}:${uuidv4()}`,
      channelName: roomName,
      owner: user,
      members: [user],
    });

    await newRoom.save();
    return newRoom;
  }

  async addMemberToChannel(userId: number, room: Room) {
    const newMember = await this.userService.getById(userId);
    console.log(room.members);
    if (
      !room.members.filter(
        (member) =>
          this.userService.getFrontUsername(member) ===
          this.userService.getFrontUsername(newMember),
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
}
