import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import Position from "/shared/interfaces/Position";

const GameLobby = (
  {
    socket,
    upgradeStep,
    canvasSize,
  }:
  {
    socket: Socket;
    upgradeStep: () => void;
    canvasSize: Position;
  }
) => {
  
  const [spectableGames, setSpectableGames] = useState<GameRoom[]>([])

  /** GAME JOIN */
  const handleJoinGame = () => {
    socket?.emit(ROUTES_BASE.GAME.JOIN_GAME_REQUEST, canvasSize);
    upgradeStep();
  }
  /** END GAME JOIN */

  const handleCreateGame = () => {
    socket?.emit(ROUTES_BASE.GAME.CREATE_GAME_REQUEST, canvasSize);
    upgradeStep();
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

  return <div className="h-7/8 w-full grid content-around">
    <div className="flex justify-around">
      <button
        className="h-1/8 bg-sky-500 hover:bg-sky-700 lg:text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50 max-h-20"
        onClick={handleCreateGame}
      >Create game</button>
      <button
        className="h-1/8 bg-sky-500 hover:bg-sky-700 lg:text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50 max-h-20"
        onClick={handleJoinGame}
      >Join game</button>
    </div>

    <div className="grid justify-around">
      <h2 className="text-center">SPECTATE</h2>
      <div>
        {
          spectableGames.map(tempGameRoom => 
            <div key={tempGameRoom.roomName}>
              <button 
                className="bg-sky-500 hover:bg-sky-700 rounded-3xl shadow-md shadow-blue-500/50"
                onClick={() => handleSpectate(tempGameRoom.roomName)}
              >{tempGameRoom.gameData.player1.pongUsername} VS {tempGameRoom.gameData.player1.pongUsername}</button>
            </div>
          )
        }
      </div>
    </div>
  </div>
} 

export default GameLobby;