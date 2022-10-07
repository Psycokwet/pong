import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard, UserPayload } from 'src/auth/jwt-ws.guard';
import { GameService } from './game.service';
import { ROUTES_BASE } from 'shared/websocketRoutes/routes';
import { UsersService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import GameRoom from 'shared/interfaces/game/GameRoom';
import PlayerInput from 'shared/interfaces/game/PlayerInput';
import { UserInterface } from 'shared/interfaces/UserInterface';
import { Status } from 'shared/interfaces/UserStatus';

@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class GameGateway implements OnGatewayConnection {
  constructor(
    private userService: UsersService,
    private gameService: GameService,
  ) {}

  private static UserNotFound = { error: 'User not found' };

  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const user = await this.userService.getUserFromSocket(client);
      if (!user) {
        throw new WsException(GameGateway.UserNotFound);
      }

      const gameRoom: GameRoom = this.gameService.findUserRoom(user.id);

      if (!gameRoom) return;
      if (
        user.id === gameRoom.gameData.player1.userId ||
        gameRoom.started === true
      ) {
        client.join(gameRoom.roomName);
        this.updateUserStatus(user, Status.PLAYING);
      }
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
    if (!user) {
      throw new WsException(GameGateway.UserNotFound);
    }
    const gameRoom: GameRoom = this.gameService.createGame(user);

    client.join(gameRoom.roomName);

    this.server
      .in(gameRoom.roomName)
      .emit(ROUTES_BASE.GAME.UPDATE_GAME, gameRoom);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.JOIN_GAME_REQUEST)
  async joinGame(
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
  ) {
    const user: User = await this.userService.getById(payload.userId);
    if (!user) {
      throw new WsException(GameGateway.UserNotFound);
    }
    const gameRoom: GameRoom = this.gameService.matchMaking(user);

    client.join(gameRoom.roomName);

    this.server
      .in(gameRoom.roomName)
      .emit(ROUTES_BASE.GAME.UPDATE_GAME, gameRoom);

    this.gameloop(gameRoom, user);
  }

  private async gameloop(gameRoom: GameRoom, player2: User) {
    if (gameRoom.started === true) {
      const opponent = await this.userService.getById(
        gameRoom.gameData.player1.userId,
      );
      if (!opponent) throw new WsException(GameGateway.UserNotFound);

      this.updateUserStatus(player2, Status.PLAYING);
      this.updateUserStatus(opponent, Status.PLAYING);
      this.server.emit(
        ROUTES_BASE.GAME.UPDATE_SPECTABLE_GAMES,
        this.gameService.getSpectableGames(),
      );
      const interval = setInterval(() => {
        const newGameRoom = this.gameService.gameLoop(gameRoom.roomName);

        this.server
          .in(gameRoom.roomName)
          .emit(ROUTES_BASE.GAME.UPDATE_GAME, newGameRoom);
        if (this.gameService.isGameFinished(newGameRoom)) {
          clearInterval(interval);
          try {
            this.gameService.handleGameOver(newGameRoom);
          } catch (e) {
            throw new WsException(e);
          }
          this.updateUserStatus(player2, Status.ONLINE);
          this.updateUserStatus(opponent, Status.ONLINE);
          this.gameService.removeGameFromGameRoomList(newGameRoom);
          this.server
            .in(gameRoom.roomName)
            .emit(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, newGameRoom);

          // get all idSocket from a room
          this.server.sockets.adapter.rooms.get(gameRoom.roomName).forEach(
            // make all socket leave the room
            (idSocket) =>
              this.server.sockets.sockets
                .get(idSocket)
                .leave(gameRoom.roomName),
          );
          this.server.emit(
            ROUTES_BASE.GAME.UPDATE_SPECTABLE_GAMES,
            this.gameService.getSpectableGames(),
          );
        }
      }, 5);
    }
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.GET_SPECTABLE_GAMES_REQUEST)
  async getSpectableGames(@ConnectedSocket() client: Socket) {
    this.server
      .in(client.id)
      .emit(
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
  @SubscribeMessage(ROUTES_BASE.GAME.RECONNECT_GAME_REQUEST)
  async reconnectGame(@UserPayload() payload: any) {
    const gameRoom: GameRoom = this.gameService.findUserRoom(payload.userId);

    if (gameRoom === undefined) {
      return;
    }

    if (
      gameRoom.gameData.player1.userId === payload.userId ||
      gameRoom.started === true
    ) {
      this.server
        .in(gameRoom.roomName)
        .emit(ROUTES_BASE.GAME.UPDATE_GAME, gameRoom);
    }
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
          status: status,
        };
        this.server.emit(ROUTES_BASE.USER.CONNECTION_CHANGE, userPlaying);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  /** CHALLENGE */
  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CREATE_CHALLENGE_REQUEST)
  async challenge(
    @MessageBody() opponentId: number,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    if (payload.userId === opponentId) return;
    const opponent = await this.userService.getById(opponentId);
    const user = await this.userService.getById(payload.userId);
    if (!user || !opponent) {
      throw new WsException(GameGateway.UserNotFound);
    }

    const newChallengeRoom: GameRoom = this.gameService.createChallenge(
      user,
      opponent,
    );

    client.join(newChallengeRoom.roomName);
    client.emit(ROUTES_BASE.GAME.UPDATE_GAME, newChallengeRoom);

    const opponentIdWebsocket = this.userService.getUserIdWebsocket(
      opponent.id,
    );

    if (opponentIdWebsocket) {
      /** Retrieve receiver's socket with the socket ID
       * https://stackoverflow.com/questions/67361211/socket-io-4-0-1-get-socket-by-id
       */

      const opponentSocket = this.server.sockets.sockets.get(
        opponentIdWebsocket.socketId,
      );
      const challengeRooms: GameRoom[] = this.gameService.findUserChallengeRoom(
        opponentIdWebsocket.userId,
      );
      opponentSocket.emit(
        ROUTES_BASE.GAME.CHALLENGE_LIST_CONFIRM,
        challengeRooms,
      );
    }
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CHALLENGE_LIST_REQUEST)
  async challengeList(
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const challengeRooms: GameRoom[] = this.gameService.findUserChallengeRoom(
      payload.userId,
    );

    if (!challengeRooms) {
      return;
    }

    client.emit(ROUTES_BASE.GAME.CHALLENGE_LIST_CONFIRM, challengeRooms);
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CHALLENGE_ACCEPT_REQUEST)
  async challengeAccept(
    @MessageBody() roomName: string,
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const challenge: GameRoom = this.gameService.findByRoomName(roomName);
    if (!challenge) {
      throw new WsException('Challenge room not found');
    }

    const player2: User = await this.userService.getById(payload.userId);
    if (!player2) {
      throw new WsException('Player2 not found');
    }

    challenge.started = true;
    this.gameService.gameStart(challenge.gameData);
    client.join(challenge.roomName);
    this.gameloop(challenge, player2);
  }
  /** END CHALLENGE */

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.CANCEL_MATCH_MAKING_REQUEST)
  async cancelMatchMaking(
    @UserPayload() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const game: GameRoom = this.gameService.cancelMatchMaking(payload.userId);
    if (game.isChallenge === true) {
      const opponentIdWebsocket = this.userService.getUserIdWebsocket(
        game.gameData.player2.userId,
      );

      if (opponentIdWebsocket) {
        /** Retrieve receiver's socket with the socket ID
         * https://stackoverflow.com/questions/67361211/socket-io-4-0-1-get-socket-by-id
         */

        const opponentSocket = this.server.sockets.sockets.get(
          opponentIdWebsocket.socketId,
        );
        const challengeRooms: GameRoom[] =
          this.gameService.findUserChallengeRoom(opponentIdWebsocket.userId);
        opponentSocket.emit(
          ROUTES_BASE.GAME.CHALLENGE_LIST_CONFIRM,
          challengeRooms,
        );
      }
    }
  }
}
