import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
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
import { ChatService } from 'src/chat/chat.service';
import { UsersWebsockets } from 'shared/interfaces/UserWebsockets';


@WebSocketGateway({
  transport: ['websocket'],
  cors: '*/*',
})
export class GameGateway implements OnGatewayDisconnect {

  constructor(
    private userService: UsersService,
    private gameService: GameService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(client.id)

    

    // try {
    //   const user = await this.userService.getUserFromSocket(client);

    //   UserGateway.userWebsockets = UserGateway.userWebsockets.filter(
    //     (websocket) => websocket.socketId !== client.id,
    //   );

    //   const disconnectingUser: UserInterface = {
    //     id: user.id,
    //     pongUsername: user.pongUsername,
    //     status: Status.OFFLINE,
    //   };
    //   this.server.emit(ROUTES_BASE.USER.CONNECTION_CHANGE, disconnectingUser);
    // } catch (e) {
    //   console.error(e.message);
    //   return;
    // }
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
            this.gameService.handleGameOver(newGameRoom);
            this.gameService.removeGameFromGameRoomList(newGameRoom);
            this.server.in(gameRoom.roomName).emit(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, newGameRoom);
            client.leave(gameRoom.roomName);

            const opponentId = gameRoom.gameData.player1.userId === user.id ?
              gameRoom.gameData.player2.userId :
              gameRoom.gameData.player1.userId;
            const receiverSocketId: UsersWebsockets = this.chatService.getUserIdWebsocket(opponentId);
            if (receiverSocketId) {
              const receiverSocket = this.server.sockets.sockets.get(
                receiverSocketId.socketId,
              );
              receiverSocket.leave(gameRoom.roomName);
            }
            gameRoom.spectatorsId
              .map(spectatorId => this.chatService.getUserIdWebsocket(spectatorId))
              .map(clientId => this.server.sockets.sockets.get(
                clientId.socketId
              ))
              .map(clientSocket => clientSocket.leave(gameRoom.roomName));
          }
        }, 10);
    }
  }

  @UseGuards(JwtWsGuard)
  @SubscribeMessage(ROUTES_BASE.GAME.GET_SPECTABLE_GAMES_REQUEST)
  async getSpectableGames(
    // @MessageBody() roomName: any,
    @ConnectedSocket() client: Socket,
    @UserPayload() payload: any,
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
      // error
      return;
    }

    gameRoom.spectatorsId.push(payload.userId);

    client.join(gameRoom.roomName);
  }
}