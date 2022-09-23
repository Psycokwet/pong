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
import GameRoom from 'shared/interfaces/GameRoom';
import GameData from 'shared/interfaces/GameData';

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

  private static gameRoomList: GameRoom[] = [];

  private static defaultGameData: GameData = {
    player1: {
      userId: 0,
      pongUsername: '',
      score: 0,
      y: 0,
    },
    player2: {
      userId: 0,
      pongUsername: '',
      score: 0,
      y: 0,
    },
    ball: {
      x: 0,
      y: 0,
      rayon: 0,
      speed: {
        x: 0,
        y: 0,
      }
    }
  }

  createGame(user: User): GameRoom {
    const newGameRoom: GameRoom = {
      roomName: 'test',
      started: false,
      gameData: { ...GameService.defaultGameData },
    }
    newGameRoom.gameData.player1.userId = user.id;
    newGameRoom.gameData.player1.pongUsername = this.userService.getFrontUsername(user);


    GameService.gameRoomList = [...GameService.gameRoomList, newGameRoom];

    return newGameRoom;
  }

  matchMaking(user: User): GameRoom {
    const gameToLaunch:GameRoom = GameService.gameRoomList.find(gameData => gameData.started === false);

    if (!gameToLaunch) return this.createGame(user);

    gameToLaunch.gameData.player2.userId = user.id;
    gameToLaunch.gameData.player2.pongUsername = this.userService.getFrontUsername(user);
    gameToLaunch.started = true;
    gameToLaunch.gameData = this.gameStart(gameToLaunch.gameData);

    return gameToLaunch;

  }

  gameStart(gameData: GameData): GameData {
    const CANVAS_WIDTH = 640;
    const CONVAS_HEIGHT = 480;
    // const PLAYER_HEIGHT = 500
    const PLAYER_HEIGHT = 100;
    const PLAYER_WIDTH = 5;
    const MAX_SPEED = 10;
    const DEFAULT_RAYON = 5;

    gameData.player1.y = CONVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2;
    gameData.player2.y = CONVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2;
    gameData.ball.x = CANVAS_WIDTH / 2;
    gameData.ball.y = CONVAS_HEIGHT / 2;
    gameData.ball.rayon = DEFAULT_RAYON;
    gameData.ball.speed.x = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
    gameData.ball.speed.y = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);

    return gameData;
  }
}