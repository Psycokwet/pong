import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import GameCanvas from "/src/components/PongGame/GameCanvas";
import GameLobby from "/src/components/PongGame/GameLobby";
import GameOver from "/src/components/PongGame/GameOver";
import GameQueue from "/src/components/PongGame/GameQueue";
import GameRoom from "/shared/interfaces/GameRoom";
import Position from "/shared/interfaces/Position";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { GameStep } from "/src/components/PongGame/GameStep.enum";
import GameSettings from "../../PongGame/GameSettings";
import { HexColorPicker } from "react-colorful";

export type GameColors = {
  ball: string;
  paddle: string;
  background: string;
};
export const defaultColor: GameColors = {
  ball: "#aabbcc",
  paddle: "#aabbcc",
  background: "#000000",
};

type PlayProps = {
  socket: Socket | undefined;
  colors: GameColors;
  setColors: Dispatch<SetStateAction<GameColors>>;
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
      return { ...current };
    });
  };

  const gameSteps = [
    <GameLobby socket={socket} setStep={setStep} setGameRoom={setGameRoom} />,
    <GameSettings setStep={setStep} />,
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
      ballColor={colors.ball}
      paddleColor={colors.paddle}
      bgColor={colors.background}
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            Ball
            <HexColorPicker
              color={defaultColor.ball}
              onChange={setRightColor("ball")}
            />
          </div>
          <div>
            Paddle
            <HexColorPicker
              color={defaultColor.paddle}
              onChange={setRightColor("paddle")}
            />
          </div>
          <div>
            Background
            <HexColorPicker
              color={defaultColor.background}
              onChange={setRightColor("background")}
            />
          </div>
          {gameSteps[step]}
        </div>
      ) : (
        gameSteps[step]
      )}
    </div>
  );
};

export default Play;
