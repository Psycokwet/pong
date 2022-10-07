import { MenuItem, SubMenu } from '@szhsin/react-menu';
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface"

const Mute = ({
  userPrivilege,
  user,
  socket,
  channelName,
}:{
  channelName: string;
  user: ChannelUserInterface;
  userPrivilege:number;
  socket: Socket | undefined;
}) => {
  const mute = (val:number) => {
    socket?.emit(ROUTES_BASE.CHAT.MUTE_USER_REQUEST, {
      userIdToMute: user.id,
      channelName: channelName,
      muteTime: val
    });
  }
  return (
    <SubMenu
      label="Mute"
      className={ userPrivilege === Privileges.MEMBER ? "hidden" : "" }
      disabled={ userPrivilege <= user.privileges }
    >
      <MenuItem onClick={()=>mute(10000)}>10 sec</MenuItem>
      <MenuItem onClick={()=>mute(60000)}>1 min</MenuItem>
      <MenuItem onClick={()=>mute(600000)}>10 min</MenuItem>
      <MenuItem onClick={()=>mute(3600000)}>1 hour</MenuItem>
    </SubMenu>
  );
}

export default Mute
