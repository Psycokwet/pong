import { Socket } from "socket.io-client";
import GameRoom from "/shared/interfaces/GameRoom";
import Position from "/shared/interfaces/Position";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { GameStep } from "/src/components/PongGame/GameStep.enum";

const GameOver = ({
    socket,
    gameRoom,
    setStep,
    clientCanvasSize,
  }:
  {
    socket: Socket,
    gameRoom: GameRoom,
    setStep: any,
    clientCanvasSize: Position,
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
    setStep(GameStep.QUEUE);
  }
  const redirectToLobby = () => {
    setStep(GameStep.LOBBY);
  }
  return <div>
    <div className="w-full h-7/8">
      <div><h1 className="text-3xl text-center p-2">RANKED MATCH</h1></div>
      <div><h2 className="lg:text-3xl text-center p-2">First to 10 points win</h2></div>
      <div className="grid sm:grid-cols-5 content-center sm:flex sm:justify-around">
        <div className="self-center text-center hidden sm:block">
          <p>{gameRoom.gameData.player1.pongUsername}</p>
          <p className="text-6xl p-4">{gameRoom.gameData.player1.score}</p>
        </div>
        <div className="flex self-center">
          <div
            // i add twice border because of tailwind border
            style={{width: clientCanvasSize.x + 16, height: clientCanvasSize.y + 8}}
            className="border-x-8 border-y-4 border-white rounded-lg flex flex-col place-content-around"
          >
              <h3 className="place-self-center sm:text-6xl text-3xl text-center">{getWinner()} WINS</h3>
              <button
                className="bg-sky-500 hover:bg-sky-700 text-2xl rounded-2xl p-4 shadow-md shadow-blue-500/50 max-w-xs place-self-center"
                onClick={redirectToLobby}
              >
                Go to GameLobby
              </button>
              <button
                className="bg-sky-500 hover:bg-sky-700 text-2xl rounded-2xl p-4 shadow-md shadow-blue-500/50 max-w-xs place-self-center"
                onClick={joinNewGame}
              >
                Join a new game
              </button>
          </div>
        </div>

        <div className="sm:hidden block grid grid-cols-2 content-between w-full">
          <div>
            <p className="text-center">{gameRoom.gameData.player1.pongUsername}</p>
            <p className="text-6xl p-4 text-center">
              <b>{gameRoom.gameData.player1.score}</b>
            </p>
          </div>

          <div>
            <p className="text-center">{gameRoom.gameData.player2.pongUsername}</p>
            <p className="text-6xl p-4 text-center">
              <b>{gameRoom.gameData.player2.score}</b>
            </p>
          </div>
        </div>

        <div className="self-center text-center hidden sm:block">
          <p>{gameRoom.gameData.player2.pongUsername}</p>
          <p className="text-6xl p-4">{gameRoom.gameData.player2.score}</p>
        </div>
      </div>
    </div>
  </div>
} 

export default GameOver;