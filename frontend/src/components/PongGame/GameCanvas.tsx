import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Position from "../../../shared/interfaces/Position";
import GameRoom from "../../../shared/interfaces/GameRoom";
import { ROUTES_BASE } from "../../../shared/websocketRoutes/routes";


const ENDPOINT = "http://localhost:8080"; // please put in env file in the future

const canvasWidth = 640
const canvasHeight = 480
// const PLAYER_HEIGHT = 500
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 10;

/**
 * 
 * documentation 
 * https://blog.devoreve.com/2018/06/06/creer-un-pong-en-javascript/
 * https://github.com/devoreve/pong/blob/master/js/main.js
 * https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
 * https://dirask.com/posts/React-mouse-button-press-and-hold-example-pzrAap
 * 
 */
function draw(canvas) {
  var context = canvas.getContext('2d');
  // Draw field
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Draw middle line
  context.strokeStyle = 'white';
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();
}

function GameCanvas() {
  const canvasRef = useRef(null);
  const [coords, setCoords] = useState<Position>({x: 0, y: 0});
  const [mousePressing,setMousePressing] = useState(true);
  const [globalCoords, setGlobalCoords] = useState<Position>({x: 0, y: 0});
  const [cdai, setCdai] = useState<GameRoom | undefined>(undefined)

  const [player1Name, setPlayer1name] = useState('');
  const [player2Name, setPlayer2name] = useState('');

  const [game, setGame] = useState({
    player: {
      score: 0,
      y: canvasHeight / 2 - PLAYER_HEIGHT / 2
    },
    computer: {
      score: 0,
      y: canvasHeight / 2 - PLAYER_HEIGHT / 2
    },
    ball: {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      r: 5,
      speed: {
        x: (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2),
        y: (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2),
      }
    }
  })

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

  /** GAME HANDLER */
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    draw(canvas)

    // Draw players
    context.fillStyle = 'white';
    context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillRect(canvas.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();

    function changeDirection(playerPosition) {
      var impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2;
      var ratio = 100 / (PLAYER_HEIGHT / 2);

      // Get a value between 0 and 10
      game.ball.speed.y = Math.round(impact * ratio / 10);
    }

    function collide(player, newGame) {
      // The player does not hit the ball
      if (newGame.ball.y < player.y || newGame.ball.y > player.y + PLAYER_HEIGHT) {

        newGame.ball.x = canvasWidth / 2;
        newGame.ball.y = canvasHeight / 2;
        newGame.ball.speed.x = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
        newGame.ball.speed.y = (1 + Math.random()) * (Math.random() > 0.5 ? 2 : -2);
        // Update score
        if (player == newGame.player) {
            newGame.computer.score++;
        } else {
            newGame.player.score++;
        }
      } else {
        // Change direction
        newGame.ball.speed.x *= -1;
        changeDirection(player.y);

        // Increase speed if it has not reached max speed
        if (Math.abs(newGame.ball.speed.x) < MAX_SPEED) {
            newGame.ball.speed.x *= 1.2;
        }
      }
      return newGame;
    }

    const interval = setInterval(() => {
      /** WEBSOCKET FOR GAME */
      // const send = (message: string) => {
        // console.log(coords);
        socket?.emit(ROUTES_BASE.GAME.SEND_INPUT, coords);
      // };
      /** END WEBSOCKET FOR GAME */
      let newGame = {...game}

      // Rebounds on top and bottom
      if (newGame.ball.y > canvasRef.current.height || newGame.ball.y < 0) {
          newGame.ball.speed.y *= -1;
      }
    
      if (newGame.ball.x > canvasRef.current.width - PLAYER_WIDTH) {
        newGame = collide(newGame.computer, newGame);
      } else if (newGame.ball.x < PLAYER_WIDTH) {
        newGame = collide(newGame.player, newGame);
      }
    
      newGame.ball.x += newGame.ball.speed.x;
      newGame.ball.y += newGame.ball.speed.y;
      setGame(newGame)

      draw(canvasRef.current)
      // Draw players
      context.fillStyle = 'white';
      context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
      context.fillRect(canvasRef.current.width - PLAYER_WIDTH, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Draw ball
      context.beginPath();
      context.fillStyle = 'white';
      context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
      context.fill();

    }, 10)

    return () => {
      clearInterval(interval)
    }
  }, [])
  /** END GAME HANDLER */


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
    if (mousePressing) {
      const canvasLocation = canvasRef.current.getBoundingClientRect();
      const mouseLocation = event.clientY - canvasLocation.y;
  
      socket?.emit(ROUTES_BASE.GAME.SEND_INPUT, {
        canvasLocation: canvasLocation,
        mouseLocation: mouseLocation,
      });
    }
  };

  const startCounter = (event) => {
    setMousePressing(true)
    setCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const stopCounter = () => {
    setMousePressing(true)
  };
  /** END MOUSE HANDLER */


  /** GAME LOOP */
  const handleGameUpdate = (gameRoom: GameRoom) => {
    if (gameRoom.started === true) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      draw(canvas)

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
    setCdai(gameRoom)
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
    if (cdai.gameData.player1.pongUsername !== '')
      playerPongUsernames.push(
        <p key={cdai.gameData.player1.pongUsername}>{cdai.gameData.player1.pongUsername} : {cdai.gameData.player1.score}</p>
      )
    if (cdai.gameData.player2.pongUsername !== '')
      playerPongUsernames.push(
        <p key={cdai.gameData.player2.pongUsername}>{cdai.gameData.player2.pongUsername} : {cdai.gameData.player2.score}</p>
      )
    return playerPongUsernames;
  }

  return (
    <div
      style={{padding: '3rem', backgroundColor: 'lightgray'}}
    >
      <h2>Final Game</h2>
      {
        cdai ? 
          displayPlayername()
          :
          <>
            <button onClick={handleCreateGame}>Create game</button>
            <div></div>
            <button onClick={handleJoinGame}>Join game</button>
          </>
      }
      <br />
      <>
        <h2>PROTOTYPE</h2>
        <div>
          <p>player1 : {game.player.score}</p>
          <p>computer : {game.computer.score}</p>
        </div>
      <canvas
          onMouseMove={handleMouseMove}
          onMouseDown={startCounter}
          onMouseUp={stopCounter}
          ref={canvasRef}
          id="canvas"
          width={canvasWidth}
          height={canvasHeight}
        ></canvas>
      </>
      {
        mousePressing ?
        <>
          <h2>DEV INFORMATIONS</h2>
          <h2>
            Coords: X: {coords.x} -- Y: {coords.y}
          </h2>
          <hr />
          <h2>
            Global coords: X: {globalCoords.x} -- Y: {globalCoords.y}
          </h2>
        </>
        :
        <></>
      }
    </div>
  );
}



export default GameCanvas;