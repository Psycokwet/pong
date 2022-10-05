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
import { virtualGameData } from 'shared/other/virtualGameData';
import { WsException } from '@nestjs/websockets';

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
      speed: { x: 0, y: 0 },
    },
  };
  private static gameRoomList: GameRoom[] = [];

  private MAX_SPEED = 10;
  private ENDGAME_POINT = 10;
  private centerPlayerPaddle = virtualGameData.playerHeight / 2;
  private halfCanvasHeight = virtualGameData.canvasHeight / 2;
  private halfCanvasWidth = virtualGameData.canvasWidth / 2;
  private speedMultiplicator = 1.2;

  createEmptyGame(): GameRoom {
    const newGameRoom: GameRoom = {
      roomName: '',
      started: false,
      isChallenge: false,
      gameData: structuredClone(GameService.defaultGameData), // deep clone
      spectatorsId: [],
    };

    return newGameRoom;
  }

  createGame(user: User): GameRoom {
    const newGameRoom: GameRoom = this.createEmptyGame();
    newGameRoom.roomName = `game:${user.login42}:${uuidv4()}`;
    newGameRoom.gameData.player1.userId = user.id;
    newGameRoom.gameData.player1.pongUsername = user.pongUsername;

    GameService.gameRoomList = [...GameService.gameRoomList, newGameRoom];

    return newGameRoom;
  }

  matchMaking(user: User): GameRoom {
    const gameToLaunch: GameRoom = GameService.gameRoomList.find(
      (gameRoom) => !gameRoom.started && !gameRoom.isChallenge,
    );

    if (!gameToLaunch) return this.createGame(user);

    gameToLaunch.gameData.player2.userId = user.id;
    gameToLaunch.gameData.player2.pongUsername = user.pongUsername;
    gameToLaunch.started = true;
    gameToLaunch.gameData = this.gameStart(gameToLaunch.gameData);

    return gameToLaunch;
  }

  gameStart(gameData: GameData): GameData {
    gameData.player1.y = this.halfCanvasHeight - this.centerPlayerPaddle;
    gameData.player2.y = this.halfCanvasHeight - this.centerPlayerPaddle;
    gameData.ball.x = this.halfCanvasWidth;
    gameData.ball.y = this.halfCanvasHeight;
    gameData.ball.rayon = virtualGameData.ballRayon;
    gameData.ball.speed.x = this.getRandomBallVector();
    gameData.ball.speed.y = this.getRandomBallVector();

    return gameData;
  }

  findUserRoom(userId: number): GameRoom | undefined {
    let index = GameService.gameRoomList.findIndex(
      (gameRoom) =>
        gameRoom.gameData.player1.userId === userId ||
        gameRoom.gameData.player2.userId === userId ||
        gameRoom.spectatorsId.includes(userId),
    );
    return GameService.gameRoomList[index]; // can be -1, so undefined
  }

  findPlayerRoom(userId: number): GameRoom | undefined {
    let index = GameService.gameRoomList.findIndex(
      (gameRoom) =>
        gameRoom.gameData.player1.userId === userId ||
        gameRoom.gameData.player2.userId === userId,
    );
    return GameService.gameRoomList[index]; // can be -1, so undefined
  }

  findIndex(copyGameRoom: GameRoom): number {
    return GameService.gameRoomList.findIndex(
      (gameRoom) => gameRoom.roomName == copyGameRoom.roomName,
    ); // can return -1, warning
  }

  findByRoomName(roomName: string): GameRoom | undefined {
    const index = GameService.gameRoomList.findIndex(
      (gameRoom) => gameRoom.roomName === roomName,
    );
    return GameService.gameRoomList[index];
  }

  updatePlayerPosition(playerInput: PlayerInput, userId: number): void {
    const gameRoom = this.findPlayerRoom(userId);
    if (gameRoom === undefined) return;

    const game: GameData = gameRoom.gameData;
    const playerToUpdate =
      userId === game.player1.userId ? 'player1' : 'player2';

    if (playerInput.mouseLocation < this.centerPlayerPaddle) {
      game[playerToUpdate].y = 0;
    } else if (
      playerInput.mouseLocation >
      playerInput.canvasLocation - this.centerPlayerPaddle
    ) {
      game[playerToUpdate].y =
        playerInput.canvasLocation - virtualGameData.playerHeight;
    } else {
      game[playerToUpdate].y =
        playerInput.mouseLocation - this.centerPlayerPaddle;
    }
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
  private getRandomBallVector() {
    const minimumSpeed: number = 2;
    const direction: number = Math.random() > 0.5 ? 1 : -1;
    const speedMinimumCoefficiant = 0.5;
    return (
      (speedMinimumCoefficiant + Math.random()) * (direction * minimumSpeed)
    );
  }

  private changeDirection(game: GameData, playerPosition: number) {
    const impact = game.ball.y - playerPosition - this.centerPlayerPaddle;
    const ratio = 100 / this.centerPlayerPaddle;

    // Get a value between 0 and 10
    game.ball.speed.y = Math.round((impact * ratio) / 10);
    return game;
  }

  private collide(player1, newGame) {
    // The player does not hit the ball
    if (
      newGame.ball.y < player1.y ||
      newGame.ball.y > player1.y + virtualGameData.playerHeight
    ) {
      newGame.ball.x = this.halfCanvasWidth;
      newGame.ball.y = this.halfCanvasHeight;
      newGame.ball.speed.x = this.getRandomBallVector();
      newGame.ball.speed.y = this.getRandomBallVector();
      // Update score
      if (player1 == newGame.player1) {
        newGame.player2.score++;
      } else {
        newGame.player1.score++;
      }
    } else {
      // Change direction
      newGame.ball.speed.x = -newGame.ball.speed.x;
      newGame = this.changeDirection(newGame, player1.y);

      // Increase speed if it has not reached max speed
      if (Math.abs(newGame.ball.speed.x) < this.MAX_SPEED) {
        newGame.ball.speed.x *= this.speedMultiplicator;
      }
    }
    return newGame;
  }

  public gameLoop(gameRoomName: string): GameRoom | undefined {
    const index = GameService.gameRoomList.findIndex(
      (gameRoom) => gameRoom.roomName === gameRoomName,
    );

    let newGame = GameService.gameRoomList[index].gameData;
    if (newGame.ball.y > virtualGameData.canvasHeight || newGame.ball.y < 0) {
      newGame.ball.speed.y = -newGame.ball.speed.y;
    }

    if (
      newGame.ball.x >
      virtualGameData.canvasWidth - virtualGameData.playerWidth
    ) {
      newGame = this.collide(newGame.player2, newGame);
    } else if (newGame.ball.x < virtualGameData.playerWidth) {
      newGame = this.collide(newGame.player1, newGame);
    }
    newGame.ball.x += newGame.ball.speed.x;
    newGame.ball.y += newGame.ball.speed.y;

    return GameService.gameRoomList[index];
  }
  /** END GAME LOOP */

  getSpectableGames(): GameRoom[] {
    return GameService.gameRoomList.filter(
      (gameRoom) => gameRoom.started === true,
    );
  }

  isGameFinished(gameRoom: GameRoom): boolean {
    return (
      gameRoom.gameData.player1.score >= this.ENDGAME_POINT ||
      gameRoom.gameData.player2.score >= this.ENDGAME_POINT
    );
  }

  public async handleGameOver(gameRoom: GameRoom): Promise<void> {
    const player1 = await this.userService.getById(
      gameRoom.gameData.player1.userId,
    );
    const player2 = await this.userService.getById(
      gameRoom.gameData.player2.userId,
    );

    if (!player1 || !player2) {
      throw new WsException('User not found');
    }
    const isPlayer1Won =
      gameRoom.gameData.player1.score > gameRoom.gameData.player2.score;

    const newGame = Game.create({
      player1_id: player1.id,
      player2_id: player2.id,
      winner: isPlayer1Won ? player1.id : player2.id,
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
    GameService.gameRoomList = GameService.gameRoomList.filter(
      (gameRoom) => gameRoom.roomName !== gameRoomToRemove.roomName,
    );
  }

  public createChallenge(user: User, opponent: User) {
    const newChallengeRoom: GameRoom = this.createEmptyGame();

    newChallengeRoom.roomName = `challenge:${user.login42}:${uuidv4()}`;
    newChallengeRoom.isChallenge = true;
    newChallengeRoom.gameData.player1.userId = user.id;
    newChallengeRoom.gameData.player1.pongUsername = user.pongUsername;
    newChallengeRoom.gameData.player2.userId = opponent.id;
    newChallengeRoom.gameData.player2.pongUsername = opponent.pongUsername;

    GameService.gameRoomList = [...GameService.gameRoomList, newChallengeRoom];

    return newChallengeRoom;
  }

  public findUserChallengeRoom(userId): GameRoom[] {
    return GameService.gameRoomList.filter(
      (gameRoom) =>
        !gameRoom.started &&
        gameRoom.isChallenge &&
        gameRoom.gameData.player2.userId === userId,
    );
  }

  public cancelMatchMaking(userId: number) {
    const gameRoomToErase: GameRoom = this.findPlayerRoom(userId);

    GameService.gameRoomList = GameService.gameRoomList.filter(
      (gameRoom) => gameRoom.roomName !== gameRoomToErase.roomName,
    );

    return gameRoomToErase;
  }
}
