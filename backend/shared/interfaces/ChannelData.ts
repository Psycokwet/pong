import { Privileges } from "./UserPrivilegesEnum";
export default interface ChannelData {
  channelName: string;
  channelId: number;
  currentUserPrivileges: Privileges;
}
