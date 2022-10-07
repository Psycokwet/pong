import React from "react";
import { GameStep } from "/src/components/PongGame/GameStep.enum";
import { GameColors } from "/shared/types/GameColors";
import { Api } from "../../api/api";
import toast from "react-hot-toast";
const api = new Api();
type GameSettingsProps = {
  setStep: any;
  colors: GameColors;
  setColors: (prevState: GameColors) => void;
};

const GameSettings: React.FC<GameSettingsProps> = ({
  setStep,
  colors,
  setColors,
}) => {
  const redirectToLobby = () => {
    setStep(GameStep.LOBBY);
    api.set_game_colors(colors).then((res: Response) => {
      if (res.status == 201) setColors(colors);
      else toast.error("Your changes couldn't be validated, an error occured");
    });
  };

  return (
    <div className="h-screen">
      <button
        className="bg-sky-500 hover:bg-sky-700 text-xl rounded-2xl p-4 shadow-md shadow-blue-500/50 max-w-xs place-self-center"
        onClick={redirectToLobby}
      >
        Back to Game Lobby and save changes
      </button>
    </div>
  );
};

export default GameSettings;
