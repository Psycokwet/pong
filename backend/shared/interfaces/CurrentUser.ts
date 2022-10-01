import { ConnectionStatus } from 'shared/enumerations/ConnectionStatus';
import { User } from 'src/user/user.entity';

export interface CurrentUser extends User {
  status: ConnectionStatus;
}
