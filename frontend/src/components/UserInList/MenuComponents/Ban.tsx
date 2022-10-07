import { MenuItem, SubMenu } from "@szhsin/react-menu";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";

const Ban = ({
  userPrivilege,
  user,
  socket,
  channelName,

}: {
  channelName: string;
  user: ChannelUserInterface;
  userPrivilege: number;
  socket: Socket | undefined;
}) => {
  const ban = (val: number) => {
    socket?.emit(ROUTES_BASE.CHAT.BAN_USER_REQUEST, {
      userIdToBan: user.id,
      channelName: channelName,
      banTime: val,
    });
  };
  return (
    <SubMenu
      label="Ban"
      className={userPrivilege === Privileges.MEMBER ? "hidden" : ""}
      disabled={userPrivilege <= user.privileges}
    >
      <MenuItem onClick={() => ban(1)}>Kick</MenuItem>
      <MenuItem onClick={() => ban(10000)}>10 sec</MenuItem>
      <MenuItem onClick={() => ban(60000)}>1 min</MenuItem>
      <MenuItem onClick={() => ban(600000)}>10 min</MenuItem>
      <MenuItem onClick={() => ban(3600000)}>1 hour</MenuItem>
    </SubMenu>
  );
};

export default Ban;
