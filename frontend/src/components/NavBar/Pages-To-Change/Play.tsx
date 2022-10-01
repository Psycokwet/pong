import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import GameCanvas from "/src/components/PongGame/GameCanvas";
import GameLobby from "/src/components/PongGame/GameLobby";
import GameOver from "/src/components/PongGame/GameOver";
import GameQueue from "/src/components/PongGame/GameQueue";
import GameRoom from "/shared/interfaces/GameRoom";
import Position from "/shared/interfaces/Position";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

const Play = ({
  socket,
}:{
  socket: Socket;
}) => {
  const [step, setStep] = useState<number>(0);

  /** WEBSOCKET */
  const [gameRoom, setGameRoom] = useState<GameRoom | undefined>(undefined)
  const [canvasSize, setCanvasSize] = useState<Position>({x: 0, y: 0})

  useEffect(() => {
    const screenIsVertical = window.innerHeight > window.innerWidth;
    const newCanvasSize: Position = { x: 0, y: 0 };
    const referenceSize = screenIsVertical ?
      window.innerWidth - window.innerWidth / 25 :
      window.innerHeight - window.innerHeight / 3;
    if (screenIsVertical) {
      newCanvasSize.x = referenceSize;
      newCanvasSize.y = (referenceSize / 4) * 3;
      setCanvasSize(newCanvasSize);
    } else {
      newCanvasSize.y = referenceSize;
      newCanvasSize.x = (referenceSize / 3) * 4;
      setCanvasSize(newCanvasSize);
    }
  }, []);

  /** RECONNECT GAME */
  useEffect(() => {
    socket?.emit(ROUTES_BASE.GAME.RECONNECT_GAME);
  }, []);

  const reconnectGame = (gameRoom: GameRoom) => {
    setStep(2);
    setGameRoom(gameRoom);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.UPDATE_GAME, reconnectGame);
    return () => {
      socket?.off(ROUTES_BASE.GAME.UPDATE_GAME, reconnectGame);
    };
  }, [reconnectGame]);
  /** END RECONNECT GAME */


  const handleGameConfirm = (gameRoom: GameRoom) => {
    setGameRoom(gameRoom);
  };
  /** GAME CREATION */
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, handleGameConfirm);
    return () => {
      socket?.off(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, handleGameConfirm);
    };
  }, [handleGameConfirm]);

  const upgradeStep = () => {
    setStep(step + 1);
  };

  const gameSteps = [
    <GameLobby
      socket={socket}
      upgradeStep={upgradeStep}
      canvasSize={canvasSize}
    />,
    <GameQueue
      canvasSize={canvasSize}
    />,
    <GameCanvas
      socket={socket}
      setGameRoom={setGameRoom}
      upgradeStep={upgradeStep}
      gameRoom={gameRoom}
      canvasSize={canvasSize}
    />,
    <GameOver
      socket={socket}
      setStep={setStep}
      gameRoom={gameRoom}
      canvasSize={canvasSize}
    />,
  ];

  return (
    <div className='bg-black text-white lg:h-7/8 sm:h-6/8 place-content-center'>
      {gameSteps[step]}
    </div>
  )
}

export default Play;
