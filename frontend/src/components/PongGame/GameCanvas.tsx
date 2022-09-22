import { useEffect, useRef, useState } from "react";

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

// function ballMove(game) {
//   const newGame = {...game}

//   // Rebounds on top and bottom
//   if (newGame.ball.y > canvas.height || newGame.ball.y < 0) {
//       newGame.ball.speed.y *= -1;
//   }

//   if (newGame.ball.x > canvas.width - PLAYER_WIDTH) {
//       collide(newGame.computer);
//   } else if (newGame.ball.x < PLAYER_WIDTH) {
//       collide(newGame.player);
//   }

//   newGame.ball.x += newGame.ball.speed.x;
//   newGame.ball.y += newGame.ball.speed.y;
// }

function GameCanvas() {
  const canvasRef = useRef(null);
  const [coords, setCoords] = useState({x: 0, y: 0});
  const [mousePressing,setMousePressing] = useState(false);
  const [globalCoords, setGlobalCoords] = useState({x: 0, y: 0});
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
        x: 2,
        y: 2
      }
    }
  })

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

    function collide(player) {
      // The player does not hit the ball
      if (game.ball.y < player.y || game.ball.y > player.y + PLAYER_HEIGHT) {
          // reset();
  
          // Update score
          if (player == game.player) {
              game.computer.score++;
              // document.querySelector('#computer-score').textContent = game.computer.score;
          } else {
              game.player.score++;
              // document.querySelector('#player-score').textContent = game.player.score;
          }
      } else {
          // Change direction
          game.ball.speed.x *= -1;
          changeDirection(player.y);
  
          // Increase speed if it has not reached max speed
          if (Math.abs(game.ball.speed.x) < MAX_SPEED) {
              game.ball.speed.x *= 1.2;
          }
      }
  }

    const interval = setInterval(() => {
      const newGame = {...game}

      // Rebounds on top and bottom
      if (newGame.ball.y > canvasRef.current.height || newGame.ball.y < 0) {
          newGame.ball.speed.y *= -1;
      }
    
      if (newGame.ball.x > canvasRef.current.width - PLAYER_WIDTH) {
          collide(newGame.computer);
      } else if (newGame.ball.x < PLAYER_WIDTH) {
          collide(newGame.player);
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
    setCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
    if (mousePressing) {
      const canvasLocation = canvasRef.current.getBoundingClientRect();
      const mouseLocation = event.clientY - canvasLocation.y;
  
      if (mouseLocation < PLAYER_HEIGHT / 2) {
          game.player.y = 0;
      } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
          game.player.y = canvas.height - PLAYER_HEIGHT;
      } else {
          game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
      }
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
    setMousePressing(false)
  };



  return (
    <div
      style={{padding: '3rem', backgroundColor: 'lightgray'}}
    >
      <canvas
        onMouseMove={handleMouseMove}
        onMouseDown={startCounter}
        onMouseUp={stopCounter}
        ref={canvasRef}
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
      {
        mousePressing ?
        <>
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