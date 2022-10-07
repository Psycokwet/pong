import { MenuItem } from "@szhsin/react-menu";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";

import { MenuSettingsType } from "../MenuSettings";

const Challenge = ({
  menuSettings,
  socket,
  user,
}: {
  menuSettings: MenuSettingsType;
  socket: Socket | undefined;
  user: UserInterface;
}) => {
  const challenge = () => {
    socket?.emit(ROUTES_BASE.GAME.CREATE_CHALLENGE_REQUEST, user.id);
  };
  return (
    <MenuItem className={menuSettings.challenge ? "" : "hidden"}>
      <Link to="/play" onClick={challenge}>
        Challenge
      </Link>
    </MenuItem>
  );
};

export default Challenge;
