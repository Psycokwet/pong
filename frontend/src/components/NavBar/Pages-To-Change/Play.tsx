import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GameCanvas from "src/components/PongGame/GameCanvas";
import GameLobby from "src/components/PongGame/GameLobby";
import GameOver from "src/components/PongGame/GameOver";
import GameQueue from "src/components/PongGame/GameQueue";
import GameRoom from "shared/interfaces/game/GameRoom";
import Position from "shared/interfaces/game/Position";
import { ROUTES_BASE } from "shared/websocketRoutes/routes";
import { GameColors, defaultColor } from "shared/types/GameColors";
import { GameStep } from "src/components/PongGame/GameStep.enum";
import GameSettings from "../../PongGame/GameSettings";
import { HexColorPicker } from "react-colorful";

type PlayProps = {
  socket: Socket | undefined;
  colors: GameColors;
  setColors: (colors: GameColors) => void;
};

const Play: React.FC<PlayProps> = ({ socket, colors, setColors }) => {
  const [step, setStep] = useState<number>(0);
  /** WEBSOCKET */
  const [gameRoom, setGameRoom] = useState<GameRoom | undefined>(undefined);
  const [clientCanvasSize, setClientCanvasSize] = useState<Position>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const isScreenVertical = window.innerHeight > window.innerWidth;
    const newClientCanvasSize: Position = { x: 0, y: 0 };
    const referenceSize = isScreenVertical
      ? // if the screen is vertical, i remove 1/25 window.width because of the border otherwise we don't see the border
        window.innerWidth - window.innerWidth / 25
      : // if the screen is horizontal, i remove 1/3 widow.height to have the game in center but not too big
        window.innerHeight - window.innerHeight / 3;

    // in this condition, i try to keep the gameBox with a ratio of 4/3
    newClientCanvasSize.x = isScreenVertical
      ? referenceSize
      : (referenceSize / 3) * 4;
    newClientCanvasSize.y = isScreenVertical
      ? (referenceSize / 4) * 3
      : referenceSize;
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

  const setRightColor = (key: string) => (newColor: string) => {
    setColors((current: GameColors) => {
      current[key as keyof GameColors] = newColor;
      return current;
    });
  };

  const setDefaultColors = () => {
    setColors((current: GameColors) => {
      return { ...defaultColor };
    });
  };

  const gameSteps = [
    <GameLobby socket={socket} setStep={setStep} setGameRoom={setGameRoom} />,
    <GameSettings setStep={setStep} colors={colors} />,
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
      colors={colors}
    />,
    <GameOver
      socket={socket}
      setStep={setStep}
      gameRoom={gameRoom}
      clientCanvasSize={clientCanvasSize}
    />,
  ];
  return (
    <div className="bg-black text-white lg:h-7/8 sm:h-6/8 place-content-center">
      {step === GameStep["SETTINGS"] ? (
        <div>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(colors).map((key) => {
              return (
                <div key={key}>
                  {key}
                  <HexColorPicker
                    color={colors[key as keyof GameColors]}
                    onChange={setRightColor(key)}
                  />
                </div>
              );
            })}
            <div>
              <button
                className="bg-red-500 hover:bg-red-700 text-xl rounded-2xl p-4 shadow-md shadow-red-500/50 max-w-xs place-self-center"
                onClick={setDefaultColors}
              >
                Reset Default Colors
              </button>
            </div>
            {gameSteps[step]}
          </div>
        </div>
      ) : (
        gameSteps[step]
      )}
    </div>
  );
};

export default Play;
