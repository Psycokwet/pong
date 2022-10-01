import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GameCanvas from "/src/components/PongGame/GameCanvas";
import GameLobby from "/src/components/PongGame/GameLobby";
import GameOver from "/src/components/PongGame/GameOver";
import GameQueue from "/src/components/PongGame/GameQueue";
import GameRoom from "/shared/interfaces/GameRoom";
import Position from "/shared/interfaces/Position";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { GameStep } from "/src/components/PongGame/GameStep.enum";

const Play = ({
  socket,
}:{
  socket: Socket;
}) => {
  const [step, setStep] = useState<number>(0);

  /** WEBSOCKET */
  const [gameRoom, setGameRoom] = useState<GameRoom | undefined>(undefined)
  const [clientCanvasSize, setClientCanvasSize] = useState<Position>({x: 0, y: 0})

  useEffect(() => {
    const isScreenVertical = window.innerHeight > window.innerWidth;
    const newClientCanvasSize: Position = { x: 0, y: 0 };
    const referenceSize = isScreenVertical ?
      window.innerWidth - window.innerWidth / 25 :
      window.innerHeight - window.innerHeight / 3;
    if (isScreenVertical) {
      newClientCanvasSize.x = referenceSize;
      newClientCanvasSize.y = (referenceSize / 4) * 3;
    } else {
      newClientCanvasSize.y = referenceSize;
      newClientCanvasSize.x = (referenceSize / 3) * 4;
    }
    setClientCanvasSize(newClientCanvasSize);
  }, []);

  /** RECONNECT GAME */
  useEffect(() => {
    socket?.emit(ROUTES_BASE.GAME.RECONNECT_GAME_REQUEST);
  }, []);
  /** END RECONNECT GAME */

  const upgradeStep = () => {
    setStep(step + 1);
  };

  const gameSteps = [
    <GameLobby
      socket={socket}
      setStep={setStep}
      setGameRoom={setGameRoom}
    />,
    <GameQueue
      socket={socket}
      setStep={setStep}
      setGameRoom={setGameRoom}
      clientCanvasSize={clientCanvasSize}
    />,
    <GameCanvas
      socket={socket}
      setGameRoom={setGameRoom}
      upgradeStep={upgradeStep}
      gameRoom={gameRoom}
      clientCanvasSize={clientCanvasSize}
    />,
    <GameOver
      socket={socket}
      setStep={setStep}
      gameRoom={gameRoom}
      clientCanvasSize={clientCanvasSize}
    />,
  ];

  return (
    <div className='bg-black text-white lg:h-7/8 sm:h-6/8 place-content-center'>
      {gameSteps[step]}
    </div>
  )
}

export default Play;
