import { ConnectionStatus } from 'shared/enumerations/ConnectionStatus';

export interface CurrentUserFrontInterface {
  login42: string;
  pongUsername: string;
  status: ConnectionStatus;
}
