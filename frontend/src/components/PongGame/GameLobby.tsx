import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Position from "/shared/interfaces/Position";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import myConfig from '../../myConfig';

const GameLobby = (
  {
    socket,
    upgradeStep,
  }:
  {
    socket: Socket,
    upgradeStep: () => void
  }
) => {
  

  /** GAME JOIN */
  const handleJoinGame = () => {
    socket?.emit(ROUTES_BASE.GAME.JOIN_GAME_REQUEST);
    upgradeStep();
  }
  /** END GAME JOIN */

  const handleCreateGame = () => {
    socket?.emit(ROUTES_BASE.GAME.CREATE_GAME_REQUEST);
    upgradeStep();
  }

  return <div>
    <button onClick={handleCreateGame}>Create game</button>
    <div></div>
    <button onClick={handleJoinGame}>Join game</button>
  </div>
} 

export default GameLobby;