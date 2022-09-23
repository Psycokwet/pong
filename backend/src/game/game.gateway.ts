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
import Position from 'shared/interfaces/Position';
import GameRoom from 'shared/interfaces/GameRoom';


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
    @MessageBody() position: Position,
    @ConnectedSocket() client: Socket
  ) {
    // console.log(position);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CREATE_GAME_REQUEST)
  async createGame(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    // console.log(payload)
    const user: User = await this.userService.getById(payload.userId);
    const gameRoom:GameRoom = this.gameService.createGame(user);

    client.join(gameRoom.roomName);

    this.server.in(client.id).emit(ROUTES_BASE.GAME.CONFIRM_GAME_CREATION, gameRoom);
    // console.log(position);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.JOIN_GAME_REQUEST)
  async joinGame(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    // console.log(payload)
    const user: User = await this.userService.getById(payload.userId);
    const gameRoom:GameRoom = this.gameService.matchMaking(user);

    client.join(gameRoom.roomName);

    // this.server.in(client.id).emit(ROUTES_BASE.GAME.CONFIRM_GAME_CREATION, gameRoom);
    // console.log(position);
  }
}