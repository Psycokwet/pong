import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import GameRoom from 'shared/interfaces/game/GameRoom';
import PlayerInput from 'shared/interfaces/game/PlayerInput';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';
import { Status, UserInterface } from 'shared/interfaces/UserInterface';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class GameGateway implements OnGatewayConnection {

  constructor(
    private userService: UsersService,
    private gameService: GameService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.userService.getUserFromSocket(client);

      if (!user) return;

      const gameRoom: GameRoom = this.gameService.findUserRoom(user.id);

      if (!gameRoom) return;
      client.join(gameRoom.roomName);
    } catch (e) {
      console.error(e.message);
    }
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.SEND_INPUT)
  async receiveInput(
    @MessageBody() playerInput: PlayerInput,
    @UserPayload() payload: any,
  ) {
    this.gameService.updatePlayerPosition(playerInput, payload.userId);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CREATE_GAME_REQUEST)
  async createGame(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const user: User = await this.userService.getById(payload.userId);
    const gameRoom: GameRoom = this.gameService.createGame(user);

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
    const gameRoom: GameRoom = this.gameService.matchMaking(user);

    client.join(gameRoom.roomName);

    this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, gameRoom);

    if (gameRoom.started === true) {
      const opponent = await this.userService.getById(gameRoom.gameData.player1.userId);
      this.updateUserStatus(user, Status.PLAYING);
      this.updateUserStatus(opponent, Status.PLAYING);
      this.server.emit(
        ROUTES_BASE.GAME.UPDATE_SPECTABLE_GAMES,
        this.gameService.getSpectableGames(),
      );
      GameService.gameIntervalList[gameRoom.roomName] = setInterval(
        () => {
          const newGameRoom = this.gameService.gameLoop(gameRoom.roomName);

          this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.UPDATE_GAME, newGameRoom);
          if (this.gameService.isGameFinished(newGameRoom))
          {
            clearInterval(GameService.gameIntervalList[newGameRoom.roomName]);
            this.updateUserStatus(user, Status.ONLINE);
            this.updateUserStatus(opponent, Status.ONLINE);
            this.gameService.handleGameOver(newGameRoom);
            this.gameService.removeGameFromGameRoomList(newGameRoom);
            this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, newGameRoom);
            client.leave(gameRoom.roomName);

            const opponentId = gameRoom.gameData.player1.userId === user.id ?
              gameRoom.gameData.player2.userId:
              gameRoom.gameData.player1.userId;
            const receiverSocketId: UsersWebsockets = this.userService.getUserIdWebsocket(opponentId);
            if (receiverSocketId) {
              const receiverSocket = this.server.sockets.sockets.get(
                receiverSocketId.socketId,
              );
              if (receiverSocket) receiverSocket.leave(gameRoom.roomName);
            }
            gameRoom.spectatorsId
              .map(spectatorId => this.userService.getUserIdWebsocket(spectatorId))
              .map(clientId => clientId ? this.server.sockets.sockets.get(clientId.socketId) : undefined)
              .map(clientSocket => clientSocket ? clientSocket.leave(gameRoom.roomName) : undefined);
          }
        }, 10);
    }
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.GET_SPECTABLE_GAMES_REQUEST)
  async getSpectableGames(
    @ConnectedSocket() client: Socket,
  ) {
    this.server.in(client.id).emit(
      ROUTES_BASE.GAME.UPDATE_SPECTABLE_GAMES,
      this.gameService.getSpectableGames(),
    );
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.JOIN_SPECTATE_REQUEST)
  async joinSpectateRequest(
    @MessageBody() roomName: string,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const gameRoom: GameRoom = this.gameService.findByRoomName(roomName);

    if (gameRoom === undefined) {
      return;
    }

    gameRoom.spectatorsId.push(payload.userId);

    client.join(gameRoom.roomName);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.RECONNECT_GAME)
  async reconnectGame(
    @UserPayload() payload: any,
  ) {
    const gameRoom: GameRoom = this.gameService.findUserRoom(payload.userId);

    if (gameRoom === undefined) {
      return;
    }

    this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.UPDATE_GAME, gameRoom);
  }

  private async updateUserStatus(user: User, status: Status) {
    try {
      if (!user) return;
      const isRegistered = UsersService.userWebsockets.find(
        (element) => element.userId === user.id,
      );

      if (isRegistered) {
        const userPlaying: UserInterface = {
          id: user.id,
          pongUsername: user.pongUsername,
          status,
        };
        this.server.emit(ROUTES_BASE.USER.CONNECTION_CHANGE, userPlaying);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}