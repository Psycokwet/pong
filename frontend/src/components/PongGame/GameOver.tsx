
import { Socket } from "socket.io-client";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

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
    socket?.emit(ROUTES_BASE.GAME.JOIN_GAME_REQUEST);
    setStep(1);
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