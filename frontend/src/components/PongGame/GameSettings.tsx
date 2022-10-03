import React from "react";
import { GameStep } from "/src/components/PongGame/GameStep.enum";

type GameSettingsProps = {
  setStep: any;
};
const GameSettings: React.FC<GameSettingsProps> = ({ setStep }) => {
  const redirectToLobby = () => {
    setStep(GameStep.LOBBY);
  };

  return (
    <div className="h-screen">
      <button
        className="bg-sky-500 hover:bg-sky-700 text-xl rounded-2xl p-4 shadow-md shadow-blue-500/50 max-w-xs place-self-center"
        onClick={redirectToLobby}
      >
        Back to Game Lobby
      </button>
    </div>
  );
};

export default GameSettings;