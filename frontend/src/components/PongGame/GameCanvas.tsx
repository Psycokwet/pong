import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Position from "/shared/interfaces/Position";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

const canvasWidth = 640
const canvasHeight = 480
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

const GameCanvas = (
  {
    socket,
    setGameRoom,
    gameRoom,
    upgradeStep,
    canvasSize,
  }:
  {
    socket: Socket,
    setGameRoom: any,
    gameRoom: GameRoom,
    upgradeStep: any,
    canvasSize: Position,
  }
) => {
  const canvasRef = useRef(null);
  const [coords, setCoords] = useState<Position>({x: 0, y: 0});
  const [globalCoords, setGlobalCoords] = useState<Position>({x: 0, y: 0});

  /** MOUSE HANDLER */
  useEffect(() => {
    // 👇️ get global mouse coordinates
    const handleWindowMouseMove = event => {
      setGlobalCoords({
        x: event.screenX,
        y: event.screenY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  const handleMouseMove = event => {
    const position: Position = {
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    }
    setCoords(position);
    const canvasLocation = canvasRef.current.getBoundingClientRect();
    const mouseLocation = event.clientY - canvasLocation.y;

    socket?.emit(ROUTES_BASE.GAME.SEND_INPUT, {
      canvasLocation: canvasLocation.height / canvasSize.y * canvasHeight,
      mouseLocation: mouseLocation / canvasSize.y * canvasHeight,
    });
  };

  const onTouchMove = event => {
    console.log(event)
    const position: Position = {
      x: event.touches[0].clientX - event.touches[0].target.offsetLeft,
      y: event.touches[0].clientY - event.touches[0].target.offsetTop,
    }
    setCoords(position);

    const canvasLocation = canvasRef.current.getBoundingClientRect();
    const mouseLocation = event.touches[0].clientY - canvasLocation.y;
    socket?.emit(ROUTES_BASE.GAME.SEND_INPUT, {
      canvasLocation: canvasLocation.height / canvasSize.y * canvasHeight,
      mouseLocation: mouseLocation / canvasSize.y * canvasHeight,
    });
  }
  /** END MOUSE HANDLER */


  /** GAME LOOP */
  const draw = (canvas, gameRoom: GameRoom) => {
    const context = canvas.getContext('2d')
    // Draw field
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvasSize.x, canvasSize.y);
    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvasSize.x / 2, 0);
    context.lineTo(canvasSize.x / 2, canvasSize.y);
    context.stroke();


    // Draw players
    context.fillStyle = 'white';
    const player1position = gameRoom.gameData.player1.y * canvasSize.y / canvasHeight;
    context.fillRect(0, player1position, PLAYER_WIDTH, PLAYER_HEIGHT * canvasSize.y / canvasHeight);
    const player2position = gameRoom.gameData.player2.y * canvasSize.y / canvasHeight;
    context.fillRect(canvas.width - PLAYER_WIDTH, player2position, PLAYER_WIDTH, PLAYER_HEIGHT * canvasSize.y / canvasHeight);

    const ballPosition: Position = {
      x: gameRoom.gameData.ball.x,
      y: gameRoom.gameData.ball.y,
    }
    ballPosition.x = gameRoom.gameData.ball.x / canvasWidth * canvasSize.x
    ballPosition.y = gameRoom.gameData.ball.y / canvasHeight * canvasSize.y
    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(ballPosition.x, ballPosition.y, gameRoom.gameData.ball.rayon, 0, Math.PI * 2, false);
    context.fill();
  }

  const handleGameUpdate = (gameRoom: GameRoom) => {
    const canvas = canvasRef.current
    draw(canvas, gameRoom)
    setGameRoom(gameRoom)
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.UPDATE_GAME, handleGameUpdate);
    return () => {
      socket?.off(ROUTES_BASE.GAME.UPDATE_GAME, handleGameUpdate);
    };
  }, []);
  /** END GAME LOOP */

  /** GAMEOVER */
  const handleGameover = () => {
    upgradeStep()
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, handleGameover);
    return () => {
      socket?.off(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, handleGameover);
    };
  }, []);
  /** END GAMEOVER */

  return (
    <div
      className="w-full bg-gray-400"
    >
      <p>{gameRoom.gameData.player1.pongUsername} : {gameRoom.gameData.player1.score}</p>
      <p>{gameRoom.gameData.player2.pongUsername} : {gameRoom.gameData.player2.score}</p>
      <br />
      <div className="flex justify-center">

        <canvas
          onTouchMove={onTouchMove}
          onMouseMove={handleMouseMove}
          ref={canvasRef}
          id="canvas"
          width={canvasSize.x}
          height={canvasSize.y}
        ></canvas>
      </div>
      <h2>DEV INFORMATIONS</h2>
      <h2>Coords: X: {coords.x} -- Y: {coords.y}</h2>
      <hr />
      <h2>Global coords: X: {globalCoords.x} -- Y: {globalCoords.y}</h2>
    </div>
  );
}



export default GameCanvas;