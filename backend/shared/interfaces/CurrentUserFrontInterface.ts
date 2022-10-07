import { ConnectionStatus } from "../enumerations/ConnectionStatus";
import { GameColors, defaultColor } from "../types/GameColors";

export interface CurrentUserFrontInterface {
  login42: string;
  pongUsername: string;
  status: ConnectionStatus;
  gameColors: GameColors;
}

export const createCurrentUserFrontInterface = () => {
  return {
    login42: "",
    pongUsername: "",
    status: ConnectionStatus.Unknown,
    gameColors: defaultColor,
  };
};

export const currentUserToFrontInterface = (currentUser: any) => {
  //can't import currentUser from back here
  return {
    login42: currentUser.login42,
    pongUsername: currentUser.pongUsername,
    status: currentUser.status,
    gameColors: JSON.parse(currentUser.gameColors),
  };
};
