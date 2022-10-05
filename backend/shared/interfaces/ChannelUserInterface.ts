import { Privileges } from "./UserPrivilegesEnum";
import { Status } from "./UserStatus";

export interface ChannelUserInterface {
  id: number;
  pongUsername: string;
  status: Status;
  privileges: Privileges;
}
