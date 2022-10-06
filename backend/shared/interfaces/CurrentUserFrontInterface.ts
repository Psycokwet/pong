import { ConnectionStatus } from '../enumerations/ConnectionStatus';
import { CurrentUser } from './CurrentUser';
import { GameColors, defaultColor } from '../types/GameColors';

export interface CurrentUserFrontInterface {
  login42: string;
  pongUsername: string;
  status: ConnectionStatus;
  gameColors: GameColors;
}

export const createCurrentUserFrontInterface = () => {
  return {
    login42: '',
    pongUsername: '',
    status: ConnectionStatus.Unknown,
    gameColors: defaultColor,
  };
};

export const currentUserToFrontInterface = (currentUser: CurrentUser) => {
  return {
    login42: currentUser.login42,
    pongUsername: currentUser.pongUsername,
    status: currentUser.status,
    gameColors: JSON.parse(currentUser.gameColors),
  };
};
