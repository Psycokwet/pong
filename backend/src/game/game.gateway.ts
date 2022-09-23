import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard, UserPayload } from 'src/auth/jwt-ws.guard';
import { GameService } from './game.service';

import { ROUTES_BASE } from 'shared/websocketRoutes/routes';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import Position from 'shared/interfaces/game/Position';
import GameRoom from 'shared/interfaces/game/GameRoom';


@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class GameGateway {
  constructor(
    private userService: UsersService,
    private gameService: GameService,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.SEND_INPUT)
  async receiveInput(
    @MessageBody() {
      canvasLocation,
      mouseLocation,
    }: {
      canvasLocation: any,
      mouseLocation: number,
    },
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const PLAYER_HEIGHT = 100;
    const gameRoom = this.gameService.findUserRoom(payload.userId)
    const game = gameRoom.gameData;
    const isPlayer1 = payload.userId === game.player1.userId;
    
    if (mouseLocation < PLAYER_HEIGHT / 2) {
        game[isPlayer1 ? 'player1' : 'player2'].y = 0;
    } else if (mouseLocation > canvasLocation.height - PLAYER_HEIGHT / 2) {
        game[isPlayer1 ? 'player1' : 'player2'].y = canvasLocation.height - PLAYER_HEIGHT;
    } else {
        game[isPlayer1 ? 'player1' : 'player2'].y = mouseLocation - PLAYER_HEIGHT / 2;
    }

    const index = this.gameService.findIndex(gameRoom);
    this.gameService.updateGameRoom(index, gameRoom);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CREATE_GAME_REQUEST)
  async createGame(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const user: User = await this.userService.getById(payload.userId);
    const gameRoom:GameRoom = this.gameService.createGame(user);

    client.join(gameRoom.roomName);

    this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, gameRoom);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.JOIN_GAME_REQUEST)
  async joinGame(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const user: User = await this.userService.getById(payload.userId);
    const gameRoom:GameRoom = this.gameService.matchMaking(user);

    client.join(gameRoom.roomName);

    this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, gameRoom);

    if (gameRoom.started === true) {
      GameService.gameIntervalList[gameRoom.roomName] = setInterval(
        () => {
          const newGameRoom = this.gameService.gameLoop(gameRoom.roomName);

          this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.UPDATE_GAME, newGameRoom);
        }, 10);
    }
  }
}