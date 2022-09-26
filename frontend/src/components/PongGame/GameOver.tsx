import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Position from "/shared/interfaces/Position";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import myConfig from '../../myConfig';

const GameOver = ({
    socket,
    gameRoom,
    setStep,
  }:
  {
    socket: Socket,
    gameRoom: GameRoom,
    setStep: any,
  }
) => {

  const getWinner = () => {
    return gameRoom.gameData.player1.score > gameRoom.gameData.player2.score ?
      gameRoom.gameData.player1.pongUsername
      :
      gameRoom.gameData.player2.pongUsername
  }
  const joinNewGame = () => {
      /** GAME JOIN */
    socket?.emit(ROUTES_BASE.GAME.JOIN_GAME_REQUEST);
    setStep(1);
  /** END GAME JOIN */
  }
  const redirectToLobby = () => {
    setStep(0);
  }
  return <div>
    <p>
      GameOver
    </p>
    <p>
      {getWinner()} WINS
    </p>
    <button onClick={joinNewGame}>
      Join a new game
    </button>
    <div></div>
    <button onClick={redirectToLobby}>
      Go to GameLobby
    </button>
  </div>
} 

export default GameOver;