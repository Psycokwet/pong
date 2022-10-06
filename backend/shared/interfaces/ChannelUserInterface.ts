import { Privileges } from "./UserPrivilegesEnum";
import { Status } from "./UserStatus";

export interface ChannelUserInterface {
  id: number;
  pongUsername: string;
  status: Status;
  privileges: Privileges;
  image_url: string; //USED BUT NEVER SET ?????? ERRORTSC
}
