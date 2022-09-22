import { useEffect, useRef, useState } from "react";


function GameCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw
    context.fillStyle = '#000000'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    console.log(canvas)
  }, [])

  const [coords, setCoords] = useState({x: 0, y: 0});

  const [globalCoords, setGlobalCoords] = useState({x: 0, y: 0});

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
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{padding: '3rem', backgroundColor: 'lightgray'}}
    >
      
      <canvas ref={canvasRef} id="canvas" width="640" height="480"></canvas>
      <h2>
        Coords: X: {coords.x} -- Y: {coords.y}
      </h2>
      <hr />
      <h2>
        Global coords: X: {globalCoords.x} -- Y: {globalCoords.y}
      </h2>
    </div>
  );
}



export default GameCanvas;