import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';
import GameRoom from 'shared/interfaces/game/GameRoom';
import GameData from 'shared/interfaces/game/GameData';
import PlayerInput from 'shared/interfaces/game/PlayerInput';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class GameService {
  constructor(
    private userService: UsersService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
    },
  }
  private static gameRoomList: GameRoom[] = [];
  public static gameIntervalList: number[] = [];

  private CANVAS_WIDTH = 640;
  private CANVAS_HEIGHT = 480;
  private PLAYER_HEIGHT = 100;
  private PLAYER_WIDTH = 5;
  private MAX_SPEED = 10;
  private DEFAULT_RAYON = 5;
  private ENDGAME_POINT = 10;

  createGame(user: User): GameRoom {
    const newGameRoom: GameRoom = {
      roomName: `game:${user.login42}:${uuidv4()}`,
      started: false,
      gameData: structuredClone(GameService.defaultGameData), // deep clone
      spectatorsId: [],
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

  findByRoomName(roomName: string): GameRoom | undefined {
    const index = GameService.gameRoomList.findIndex(gameRoom => 
      gameRoom.roomName === roomName
    )
    return GameService.gameRoomList[index];
  }

  updatePlayerPosition(playerInput: PlayerInput, userId: number): void {
    const gameRoom = this.findUserRoom(userId)
    if (gameRoom === undefined) return;

    const game = gameRoom.gameData;
    const playerToUpdate = userId === game.player1.userId ? 'player1' : 'player2';
    
    if (playerInput.mouseLocation < this.PLAYER_HEIGHT / 2) {
        game[playerToUpdate].y = 0;
    } else if (playerInput.mouseLocation > playerInput.canvasLocation - this.PLAYER_HEIGHT / 2) {
        game[playerToUpdate].y = playerInput.canvasLocation - this.PLAYER_HEIGHT;
    } else {
        game[playerToUpdate].y = playerInput.mouseLocation - this.PLAYER_HEIGHT / 2;
    }

    GameService.gameRoomList[this.findIndex(gameRoom)] = gameRoom;
  }

  /** GAME LOOP */
  /**
   * DOCUMENTATION 
   * https://blog.devoreve.com/2018/06/06/creer-un-pong-en-javascript/
   * https://github.com/devoreve/pong/blob/master/js/main.js
   * https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
   * https://dirask.com/posts/React-mouse-button-press-and-hold-example-pzrAap
   * 
   */
  private changeDirection(game, playerPosition) {
    const impact = game.ball.y - playerPosition - this.PLAYER_HEIGHT / 2;
    const ratio = 100 / (this.PLAYER_HEIGHT / 2);

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
    return game;
  }

  private collide(player1, newGame) {
    // The player does not hit the ball
    if ( newGame.ball.y < player1.y || newGame.ball.y >  player1.y + this.PLAYER_HEIGHT) {
      newGame.ball.x = this.CANVAS_WIDTH / 2;
      newGame.ball.y = this.CANVAS_HEIGHT / 2;
      newGame.ball.speed.x = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
      newGame.ball.speed.y = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
      // Update score
      if (player1 === newGame.player1) {
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

  public gameLoop(gameRoomName: string): GameRoom | undefined {
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

  getSpectableGames(): GameRoom[] {
    return GameService.gameRoomList.filter(gameRoom => gameRoom.started === true)
  }

  isGameFinished(gameRoom: GameRoom): boolean {
    return (
      gameRoom.gameData.player1.score >= this.ENDGAME_POINT
      ||
      gameRoom.gameData.player2.score >= this.ENDGAME_POINT
    )
  }

  public async handleGameOver(gameRoom: GameRoom): Promise<void> {
    const player1 = await this.userService.getById(gameRoom.gameData.player1.userId);
    const player2 = await this.userService.getById(gameRoom.gameData.player2.userId);
    const isPlayer1Won = gameRoom.gameData.player1.score > gameRoom.gameData.player2.score;

    const newGame = Game.create({
      player1_id: player1.id,
      player2_id: player2.id,
      winner: 
      isPlayer1Won ?
          player1.id :
          player2.id,
      player1: player1,
      player2: player2,
      player1Score: gameRoom.gameData.player1.score,
      player2Score: gameRoom.gameData.player2.score,
    });

    await newGame.save();

    await this.usersRepository.update(player1.id, {
      xp: player1.xp + (isPlayer1Won ? 2 : 1),
    });

    await this.usersRepository.update(player2.id, {
      xp: player2.xp + (isPlayer1Won ? 1 : 2),
    });
  }

  public removeGameFromGameRoomList(gameRoomToRemove: GameRoom): void {
    GameService.gameRoomList = GameService
      .gameRoomList
      .filter((gameRoom => gameRoom.roomName !== gameRoomToRemove.roomName));
  }
}