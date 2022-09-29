import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client";
import GameCanvas from '/src/components/PongGame/GameCanvas'
import GameLobby from '/src/components/PongGame/GameLobby';
import GameOver from '/src/components/PongGame/GameOver';
import GameQueue from '/src/components/PongGame/GameQueue';
import GameRoom from "/shared/interfaces/GameRoom";
import Position from "/shared/interfaces/Position";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

const ENDPOINT = "http://localhost:8080/";

const Play = () => {
  const [step, setStep] = useState<number>(0);

  /** WEBSOCKET */
  const [socket, setSocket] = useState<Socket>();
  const [gameRoom, setGameRoom] = useState<GameRoom | undefined>(undefined)
  const [canvasSize, setCanvasSize] = useState<Position>({x: 0, y: 0})

  useEffect(() => {
    const screenIsVertical =  window.innerHeight >  window.innerWidth;
    const newCanvasSize: Position = { x: 0, y: 0 };
    const referenceSize = screenIsVertical ?
      window.innerWidth:
      window.innerHeight - window.innerHeight / 3;
    if (screenIsVertical) {
      newCanvasSize.x = referenceSize;
      newCanvasSize.y = referenceSize / 4 * 3
      setCanvasSize(newCanvasSize)
    } else {
      newCanvasSize.y = referenceSize;
      newCanvasSize.x = referenceSize / 3 * 4;
      setCanvasSize(newCanvasSize)
    }
  }, []);

  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, []);

  const handleGameConfirm = (gameRoom: GameRoom) => {
    setGameRoom(gameRoom)
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
  }

  const gameSteps = [
    <GameLobby
      socket={socket}
      upgradeStep={upgradeStep}
      canvasSize={canvasSize}
    />,
    <GameQueue
      socket={socket}
      upgradeStep={upgradeStep}
      setGameRoom={setGameRoom}
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
    />,
  ];

  return (
    <>
      <h1 className='text-violet-600'>I'm Play page</h1>
      {gameSteps[step]}
    </>
  )
}

export default Play