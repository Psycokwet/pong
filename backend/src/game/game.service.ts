import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
// import Message from './message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
// import Room from './room.entity';
import { UsersService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { ChatRoom } from 'shared/interfaces/ChatRoom';

@Injectable()
export class GameService {

  constructor(
    private readonly authService: AuthService,
    // @InjectRepository(Message)
    // private messagesRepository: Repository<Message>,
    // @InjectRepository(Room)
    // private roomsRepository: Repository<Room>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UsersService,
  ) {}

}