import Position from "/shared/interfaces/game/Position";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import GameRoom from "/shared/interfaces/game/GameRoom";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { GameStep } from "/src/components/PongGame/GameStep.enum";

const GameQueue = ({
  clientCanvasSize,
  socket,
  setStep,
  setGameRoom,
}: {
  clientCanvasSize: Position;
  socket: Socket | undefined;
  setStep: any;
  setGameRoom: any;
}) => {
  const updateStep = (gameRoom: GameRoom) => {
    if (gameRoom.started === true) setStep(GameStep.PLAYING);
    else setStep(GameStep.QUEUE);
    setGameRoom(gameRoom);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.GAME.UPDATE_GAME, updateStep);
    return () => {
      socket?.off(ROUTES_BASE.GAME.UPDATE_GAME, updateStep);
    };
  }, []);

  const cancelGameSearch = () => {
    socket?.emit(ROUTES_BASE.GAME.CANCEL_MATCH_MAKING_REQUEST);
    setStep(GameStep.LOBBY);
  };

  return (
    <div>
      <div className="w-full h-screen">
        {/* i didn't know ths size of the text as they are on all pages so the font-color is black... */}
        {/* and black on black... */}
        <div>
          <h1 className="text-black text-3xl text-center p-2">RANKED MATCH</h1>
        </div>
        <div className="flex place-content-around">
          <button
            className="text-white lg:text-3xl p-2"
            onClick={cancelGameSearch}
          >
            Cancel
          </button>
        </div>
        <div className="grid sm:grid-cols-5 content-center sm:flex sm:justify-around">
          <div className="flex self-center">
            <div
              // i add twice border because of tailwind border
              // border-x-8 makes 16px horizontal border
              // border-y-4 makes 8px vertical border
              style={{
                width: clientCanvasSize.x + 16,
                height: clientCanvasSize.y + 8,
              }}
              className="border-x-8 border-y-4 border-white rounded-lg flex flex-col place-content-around"
            >
              <img
                style={{ width: "auto" }}
                className="place-self-center sm:h-full h-3/5"
                src={"/aniek-janssen-loading-icon-export.gif"}
              />
              <h1 className="sm:text-3xl text-center p-8">
                <b>Looking for an opponent</b>
              </h1>
            </div>
          </div>
          <div className="sm:hidden block grid grid-cols-2 content-between w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GameQueue;
