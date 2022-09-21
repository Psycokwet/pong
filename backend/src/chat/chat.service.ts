import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import Message from './message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import Room from './room.entity';
import { UsersService } from 'src/users/users.service';
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
        // delete room.roomName;
        return {
          channelId: room.id,
          channelName: room.channelName,
        };
      }),
    );
  }

  public async getRoomById(id: number) {
    return this.roomsRepository.findOneBy({ id });
  }

  async saveRoom(roomName: string, clientId: string, userId: number) {
    const user = await this.userService.getById(userId);

    const newRoom = await Room.create({
      roomName: `channel:${roomName}:${uuidv4()}`,
      channelName: roomName,
      owner: user,
      members: [user],
    });

    return newRoom.save();
  }

  async addMemberToChannel(userId: number, room: Room) {
    console.log('userId', userId);
    const newMember = await this.userService.getById(userId);
    console.log('newMember', newMember);
    // let nbMembers = room.members.length;
    // const newMember = await room.members
    // console.log(`Nb members before pushing: ${nbMembers}`);
    console.log(room.members);
    // room.members.push(newMember);
    room.members = [newMember];
    const nbMembers = room.members.length;
    console.log(`Nb members after pushing: ${nbMembers}`);
    room.save();
  }

  async saveMessage(content: string, author: User) {
    const newMessage = await this.messagesRepository.create({
      content,
      author,
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
