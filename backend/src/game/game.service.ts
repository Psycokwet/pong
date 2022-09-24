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
import GameRoom from 'shared/interfaces/game/GameRoom';
import GameData from 'shared/interfaces/game/GameData';
import PlayerInput from 'shared/interfaces/game/PlayerInput';

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
  public static gameIntervalList: number[] = [];

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
  private CANVAS_WIDTH = 640;
  private CANVAS_HEIGHT = 480;
  private PLAYER_HEIGHT = 100;
  private PLAYER_WIDTH = 5;
  private MAX_SPEED = 10;
  private DEFAULT_RAYON = 5;

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
    const gamesToLaunch:GameRoom[] = GameService.gameRoomList.filter(gameRoom => !gameRoom.started);

    const gameToLaunch = gamesToLaunch.length ? gamesToLaunch[0] : undefined;

    if (!gameToLaunch) return this.createGame(user);

    gameToLaunch.gameData.player2.userId = user.id;
    gameToLaunch.gameData.player2.pongUsername = this.userService.getFrontUsername(user);
    gameToLaunch.started = true;
    gameToLaunch.gameData = this.gameStart(gameToLaunch.gameData);
    // console.log(gameToLaunch.gameData)

    return gameToLaunch;
  }

  gameStart(gameData: GameData): GameData {
    gameData.player1.y = this.CANVAS_HEIGHT / 2 - this.PLAYER_HEIGHT / 2;
    gameData.player2.y = this.CANVAS_HEIGHT / 2 - this.PLAYER_HEIGHT / 2;
    gameData.ball.x = this.CANVAS_WIDTH / 2;
    gameData.ball.y = this.CANVAS_HEIGHT / 2;
    gameData.ball.rayon = this.DEFAULT_RAYON;
    gameData.ball.speed.x = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
    gameData.ball.speed.y = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);

    return gameData;
  }

  findUserRoom(userId: number): GameRoom | undefined {
    const index = GameService.gameRoomList.findIndex(gameRoom => 
      gameRoom.gameData.player1.userId === userId
      ||
      gameRoom.gameData.player2.userId === userId
    )
    return GameService.gameRoomList[index]; // can be -1, so undefined
  }

  findIndex(copyGameRoom: GameRoom): number {
    return GameService.gameRoomList.findIndex(gameRoom => gameRoom.roomName == copyGameRoom.roomName); // can return -1, warning
  }

  updatePlayerPosition(playerInput: PlayerInput, userId: number): void {
    const gameRoom = this.findUserRoom(userId)
    if (gameRoom === undefined) return;

    const game = gameRoom.gameData;
    const playerToUpdate = userId === game.player1.userId ? 'player1' : 'player2';
    
    if (playerInput.mouseLocation < this.PLAYER_HEIGHT / 2) {
        game[playerToUpdate].y = 0;
    } else if (playerInput.mouseLocation > playerInput.canvasLocation.height - this.PLAYER_HEIGHT / 2) {
        game[playerToUpdate].y = playerInput.canvasLocation.height - this.PLAYER_HEIGHT;
    } else {
        game[playerToUpdate].y = playerInput.mouseLocation - this.PLAYER_HEIGHT / 2;
    }

    GameService.gameRoomList[this.findIndex(gameRoom)] = gameRoom;
  }

  /** GAME LOOP */
  private changeDirection(game, playerPosition) {
    const impact = game.ball.y - playerPosition - this.PLAYER_HEIGHT / 2;
    const ratio = 100 / (this.PLAYER_HEIGHT / 2);

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
    return game;
  }

  private collide(player1, newGame) {
    // The player does not hit the ball
    if (newGame.ball.y < player1.y || newGame.ball.y > player1.y + this.PLAYER_HEIGHT) {

      newGame.ball.x = this.CANVAS_WIDTH / 2;
      newGame.ball.y = this.CANVAS_HEIGHT / 2;
      newGame.ball.speed.x = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
      newGame.ball.speed.y = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
      // Update score
      if (player1 == newGame.player1) {
          newGame.player2.score++;
      } else {
          newGame.player1.score++;
      }
    } else {
      // Change direction
      newGame.ball.speed.x *= -1;
      newGame = this.changeDirection(newGame, player1.y);

      // Increase speed if it has not reached max speed
      if (Math.abs(newGame.ball.speed.x) < this.MAX_SPEED) {
          newGame.ball.speed.x *= 1.2;
      }
    }
    return newGame;
  }

  gameLoop(gameRoomName: string): GameRoom | undefined {
    const index = GameService.gameRoomList.findIndex(gameRoom => gameRoom.roomName === gameRoomName)

    let newGame = GameService.gameRoomList[index].gameData
    if (newGame.ball.y > this.CANVAS_HEIGHT || newGame.ball.y < 0) {
        newGame.ball.speed.y *= -1;
    }
  
    if (newGame.ball.x > this.CANVAS_WIDTH - this.PLAYER_WIDTH) {
      newGame = this.collide(newGame.player2, newGame);
    } else if (newGame.ball.x < this.PLAYER_WIDTH) {
      newGame = this.collide(newGame.player1, newGame);
    }
    newGame.ball.x += newGame.ball.speed.x;
    newGame.ball.y += newGame.ball.speed.y;
    GameService.gameRoomList[index].gameData.ball = newGame.ball;

    return GameService.gameRoomList[index];
  }
  /** END GAME LOOP */
}