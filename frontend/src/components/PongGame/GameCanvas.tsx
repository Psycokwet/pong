import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import Position from "/shared/interfaces/Position";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { virtualGameData } from "/shared/other/virtualGameData";

const GameCanvas = (
  {
    socket,
    setGameRoom,
    gameRoom,
    upgradeStep,
    clientCanvasSize,
  }:
  {
    socket: Socket,
    setGameRoom: any,
    gameRoom: GameRoom,
    upgradeStep: any,
    clientCanvasSize: Position,
  }
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasLocation = canvasRef?.current?.getBoundingClientRect();
    if (canvasLocation) {
      const mouseLocation = event.clientY - canvasLocation.y;
      
      // because of the border, i needed a offset
      const offset = 8 / clientCanvasSize.y * virtualGameData.canvasHeight; 
      socket?.emit(ROUTES_BASE.GAME.SEND_INPUT, {
        canvasLocation: canvasLocation.height / clientCanvasSize.y * virtualGameData.canvasHeight - offset,
        mouseLocation: mouseLocation / clientCanvasSize.y * virtualGameData.canvasHeight,
      });
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const canvasLocation = canvasRef?.current?.getBoundingClientRect();
    if (canvasLocation) {
      const mouseLocation = event.touches[0].clientY - canvasLocation.y;

      const offset = 8 / clientCanvasSize.y * virtualGameData.canvasHeight;
      socket?.emit(ROUTES_BASE.GAME.SEND_INPUT, {
        canvasLocation: canvasLocation.height / clientCanvasSize.y * virtualGameData.canvasHeight - offset,
        mouseLocation: mouseLocation / clientCanvasSize.y * virtualGameData.canvasHeight,
      });
    }
  }
  /** END MOUSE HANDLER */


  /** GAME LOOP */
  const draw = (canvas: HTMLCanvasElement, gameRoom: GameRoom) => {
    const context = canvas.getContext('2d')
    if (context) {
      // Draw field
      context.fillStyle = 'black';
      context.fillRect(0, 0, clientCanvasSize.x, clientCanvasSize.y);
      // Draw middle line
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(clientCanvasSize.x / 2, 0);
      context.lineTo(clientCanvasSize.x / 2, clientCanvasSize.y);
      context.stroke();


      // Draw players
      context.fillStyle = 'white';
      const player1position = gameRoom.gameData.player1.y * clientCanvasSize.y / virtualGameData.canvasHeight;
      context.fillRect(0, player1position, virtualGameData.playerWidth, virtualGameData.playerHeight * clientCanvasSize.y / virtualGameData.canvasHeight);
      const player2position = gameRoom.gameData.player2.y * clientCanvasSize.y / virtualGameData.canvasHeight;
      context.fillRect(canvas.width - virtualGameData.playerWidth, player2position, virtualGameData.playerWidth, virtualGameData.playerHeight * clientCanvasSize.y / virtualGameData.canvasHeight);

      const ballPosition: Position = {
        x: gameRoom.gameData.ball.x,
        y: gameRoom.gameData.ball.y,
      }
      ballPosition.x = gameRoom.gameData.ball.x / virtualGameData.canvasWidth * clientCanvasSize.x
      ballPosition.y = gameRoom.gameData.ball.y / virtualGameData.canvasHeight * clientCanvasSize.y
      // Draw ball
      context.beginPath();
      context.fillStyle = 'white';
      context.arc(ballPosition.x, ballPosition.y, gameRoom.gameData.ball.rayon / virtualGameData.canvasHeight * clientCanvasSize.y , 0, Math.PI * 2, false);
      context.fill();
    }
  }

  const handleGameUpdate = (gameRoom: GameRoom) => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) draw(canvas, gameRoom);
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
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, upgradeStep);
    return () => {
      socket?.off(ROUTES_BASE.GAME.GAMEOVER_CONFIRM, upgradeStep);
    };
  }, []);
  /** END GAMEOVER */

  return (
    <div
      className="w-full h-7/8"
    >
      <div><h1 className="text-3xl text-center p-2">RANKED MATCH</h1></div>
      <div><h2 className="lg:text-3xl text-center p-2">First to 10 points win</h2> </div>
      <div
        className="grid sm:grid-cols-5 content-center sm:flex sm:justify-around"
      >
        <div className="self-center text-center hidden sm:block">
          <p>{gameRoom.gameData.player1.pongUsername}</p>
          <p className="text-6xl p-4">{gameRoom.gameData.player1.score}</p>
        </div>
        <div className="flex self-center">
          <canvas
            className="border-x-8 border-y-4 border-white rounded-lg"
            onTouchMove={onTouchMove}
            onMouseMove={handleMouseMove}
            ref={canvasRef}
            id="canvas"
            width={clientCanvasSize.x}
            height={clientCanvasSize.y}
            ></canvas>
        </div>

        <div className="sm:hidden block grid grid-cols-2 content-between w-full">
          <div>
            <p className="text-center">{gameRoom.gameData.player1.pongUsername} </p>
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
          <p className="text-6xl p-4">
            {gameRoom.gameData.player2.score}
          </p>
        </div>
      </div>
    </div>
  );
}



export default GameCanvas;