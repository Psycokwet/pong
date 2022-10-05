import { MenuItem } from '@szhsin/react-menu';
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";

import { MenuSettingsType } from "../MenuSettings";

const SendDirectMessage = ({
  socket,
  user,
}:{
  socket:Socket|undefined;
  user:UserInterface;
}) => {
  const sendDirectMessage = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_DM, user.id)
  }
  return (
    <MenuItem onClick={sendDirectMessage}>
      <Link to="/chat">Send a Direct Message</Link>
    </MenuItem>
  );
}

export default SendDirectMessage
