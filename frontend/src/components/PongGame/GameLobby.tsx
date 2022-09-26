import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

const GameLobby = (
  {
    socket,
    upgradeStep,
  }:
  {
    socket: Socket;
    upgradeStep: () => void;
  }
) => {
  
  const [spectableGames, setSpectableGames] = useState<GameRoom[]>([])

  /** GAME JOIN */
  const handleJoinGame = () => {
    socket?.emit(ROUTES_BASE.GAME.JOIN_GAME_REQUEST);
    upgradeStep();
  }
  /** END GAME JOIN */

  const handleCreateGame = () => {
    socket?.emit(ROUTES_BASE.GAME.CREATE_GAME_REQUEST);
    `upgradeStep`();
  }

  /** SPECTATE */
  const handleSpectate = (roomName: string) => {
    socket?.emit(ROUTES_BASE.GAME.JOIN_SPECTATE_REQUEST, roomName);
    upgradeStep()
  }
  /** END SPECTACTE */

  useEffect(() => {
    socket?.emit(ROUTES_BASE.GAME.GET_SPECTABLE_GAMES_REQUEST)
  }, [socket]);

  /** UPDATE SPECTABLE GAMES */
  const updateSpectableGames = (spectableGames: GameRoom[]) => {
    setSpectableGames(spectableGames);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.UPDATE_SPECTABLE_GAMES, updateSpectableGames);
    return () => {
      socket?.off(ROUTES_BASE.GAME.UPDATE_SPECTABLE_GAMES, updateSpectableGames);
    };
  }, [updateSpectableGames]);
  /** END UPDATE SPECTABLE GAMES */

  return <div>
    <h2>PLAY</h2>
    <button onClick={handleCreateGame}>Create game</button>
    <div></div>
    <button onClick={handleJoinGame}>Join game</button>
    <br />

    <h2>SPECTATE</h2>
    {
      spectableGames.map(tempGameRoom => 
        <div key={tempGameRoom.roomName}>
          <button onClick={() => handleSpectate(tempGameRoom.roomName)}>{tempGameRoom.roomName}</button>
        </div>
      )
    }
  </div>
} 

export default GameLobby;