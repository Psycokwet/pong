import { MenuItem } from '@szhsin/react-menu';
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";

import { MenuSettingsType } from "../MenuSettings";

const AddFriend = ({
  menuSettings,
  socket,
  user,
}:{
  menuSettings: MenuSettingsType;
  socket: Socket|undefined;
  user: UserInterface;
})=>{
  const addFriend = () => {
    socket?.emit(ROUTES_BASE.USER.ADD_FRIEND_REQUEST, user.pongUsername);
  }
  return (
    <MenuItem className={ menuSettings.friend ? "hidden" : "" }>
      <div onClick={addFriend}>Add as Friend</div>
    </MenuItem>
  );
}

export default AddFriend
