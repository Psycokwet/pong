import { ConnectionStatus } from "../enumerations/ConnectionStatus";
import { CurrentUser } from "./CurrentUser";

export interface CurrentUserFrontInterface {
  login42: string;
  pongUsername: string;
  status: ConnectionStatus;
}

export const createCurrentUserFrontInterface = () => {
  return { login42: "", pongUsername: "", status: ConnectionStatus.Unknown };
};

export const currentUserToFrontInterface = (currentUser: CurrentUser) => {
  return {
    login42: currentUser.login42,
    pongUsername: currentUser.pongUsername,
    status: currentUser.status,
  };
};
