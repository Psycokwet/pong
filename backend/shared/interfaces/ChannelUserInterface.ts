import { Privileges } from "./UserPrivilegesEnum";
import { Status } from "./UserStatus";

interface ChannelUserInterface {
  id: number;
  pongUsername: string;
  status: Status;
  privileges: Privileges;
}
export default ChannelUserInterface;
