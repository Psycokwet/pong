import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Position from "/shared/interfaces/Position";
import GameRoom from "/shared/interfaces/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

const ENDPOINT = "http://localhost:8080"; // please put in env file in the future

const canvasWidth = 640
const canvasHeight = 480
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

/**
 * 
 * documentation 
 * https://blog.devoreve.com/2018/06/06/creer-un-pong-en-javascript/
 * https://github.com/devoreve/pong/blob/master/js/main.js
 * https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
 * https://dirask.com/posts/React-mouse-button-press-and-hold-example-pzrAap
 * 
 */

function GameCanvas() {
  const canvasRef = useRef(null);
  const [coords, setCoords] = useState<Position>({x: 0, y: 0});
  const [globalCoords, setGlobalCoords] = useState<Position>({x: 0, y: 0});
  const [gameRoom, setGameRoom] = useState<GameRoom | undefined>(undefined)
  const [spectableGames, setSpectableGames] = useState<GameRoom[]>([])

  /** WEBSOCKET */
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, []);
  /** END WEBSOCKET */


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
      canvasLocation: canvasLocation,
      mouseLocation: mouseLocation,
    });
  };

  /** END MOUSE HANDLER */


  /** GAME LOOP */
  const draw = (canvas, gameRoom: GameRoom) => {
    const context = canvas.getContext('2d')
    // Draw field
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();


    // Draw players
    context.fillStyle = 'white';
    context.fillRect(0, gameRoom.gameData.player1.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, gameRoom.gameData.player2.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(gameRoom.gameData.ball.x, gameRoom.gameData.ball.y, gameRoom.gameData.ball.rayon, 0, Math.PI * 2, false);
    context.fill();
  }

  const handleGameUpdate = (gameRoom: GameRoom) => {
    if (gameRoom.started === true) {
      const canvas = canvasRef.current
      draw(canvas, gameRoom)
    }
    setGameRoom(gameRoom)
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.UPDATE_GAME, handleGameUpdate);
    return () => {
      socket?.off(ROUTES_BASE.GAME.UPDATE_GAME, handleGameUpdate);
    };
  }, [handleGameUpdate]);
  /** END GAME LOOP */

  /** GAME CREATION */
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, handleGameUpdate);
    return () => {
      socket?.off(ROUTES_BASE.GAME.CONFIRM_GAME_JOINED, handleGameUpdate);
    };
  }, [handleGameUpdate]);

  const handleCreateGame = () => {
    socket?.emit(ROUTES_BASE.GAME.CREATE_GAME_REQUEST);
  }
  /** END GAME CREATION */



  
  /** GAME JOIN */
  const handleJoinGame = () => {
    socket?.emit(ROUTES_BASE.GAME.JOIN_GAME_REQUEST);
  }
  /** END GAME JOIN */

  const displayPlayername = () => {
    const playerPongUsernames = [];
    if (gameRoom.gameData.player1.pongUsername !== '')
      playerPongUsernames.push(
        <p key={gameRoom.gameData.player1.pongUsername}>{gameRoom.gameData.player1.pongUsername} : {gameRoom.gameData.player1.score}</p>
      )
    if (gameRoom.gameData.player2.pongUsername !== '')
      playerPongUsernames.push(
        <p key={gameRoom.gameData.player2.pongUsername}>{gameRoom.gameData.player2.pongUsername} : {gameRoom.gameData.player2.score}</p>
      )
    return playerPongUsernames;
  }

  /** SPECTATE */
  const handleSpectate = (roomName: string) => {
    socket?.emit(ROUTES_BASE.GAME.JOIN_SPECTATE_REQUEST, roomName);
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


  return (
    <div
      style={{padding: '3rem', backgroundColor: 'lightgray'}}
    >
      <h2>Final Game</h2>
      {
        gameRoom ? 
          displayPlayername()
          :
          <>
            <button onClick={handleCreateGame}>Create game</button>
            <div></div>
            <button onClick={handleJoinGame}>Join game</button>
          </>
      }
      <br />
      <h2>SPECTATE CDAI TEST</h2>
      {
        gameRoom ?
          <></>
          :
          spectableGames.map(tempGameRoom => 
            <div key={tempGameRoom.roomName}>
              <button onClick={() => handleSpectate(tempGameRoom.roomName)}>{tempGameRoom.roomName}</button>
            </div>
          )
      }
      <br />
      <canvas
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
      <h2>DEV INFORMATIONS</h2>
      <h2>Coords: X: {coords.x} -- Y: {coords.y}</h2>
      <hr />
      <h2>Global coords: X: {globalCoords.x} -- Y: {globalCoords.y}</h2>
    </div>
  );
}



export default GameCanvas;