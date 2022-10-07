import { MenuItem } from '@szhsin/react-menu';

import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";

const SetAdmin = ({
  userPrivilege,
  pointedUser,
  socket,
  channelName,
}:{
  userPrivilege:Privileges;
  pointedUser:ChannelUserInterface;
  socket: Socket | undefined;
  channelName: string;
}) => {
  const setAdmin = () => {
    if (pointedUser.privileges === Privileges.MEMBER)
      socket?.emit(ROUTES_BASE.CHAT.SET_ADMIN_REQUEST,
        {userIdToUpdate:pointedUser.id, channelName:channelName});
    else
      socket?.emit(ROUTES_BASE.CHAT.UNSET_ADMIN_REQUEST,
        {userIdToUpdate:pointedUser.id, channelName:channelName});
  }
  return (
    <MenuItem
      className={userPrivilege === Privileges.OWNER ? "" : "hidden"}
      disabled={pointedUser.privileges === Privileges.OWNER}
      onClick={setAdmin}
    >
      { pointedUser.privileges===Privileges.MEMBER ?
      <p>Give Admin Rights</p>
      :
      <p>Remove Admin Rights</p>
      }
    </MenuItem>
  );
}

export default SetAdmin
