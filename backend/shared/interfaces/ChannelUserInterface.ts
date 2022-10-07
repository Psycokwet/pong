import { Privileges } from "./UserPrivilegesEnum";
import { Status } from "./UserStatus";

interface ChannelUserInterface {
  id: number;
  pongUsername: string;
  status: Status;
  privileges: Privileges;
  image_url: string; //USED BUT NEVER SET ?????? ERRORTSC
}
export default ChannelUserInterface;
