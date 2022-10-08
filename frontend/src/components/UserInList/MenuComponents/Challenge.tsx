import { MenuItem } from "@szhsin/react-menu";
import { Link } from "react-router-dom";
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const challenge = () => {
    socket?.emit(ROUTES_BASE.GAME.CREATE_CHALLENGE_REQUEST, user.id);
    navigate("/play");
  };
  return (
    <MenuItem
      className={menuSettings.challenge ? "" : "hidden"}
      onClick={challenge}
    >
      {/* <Link to="/play" > */}
      Challenge
      {/* </Link> */}
    </MenuItem>
  );
};

export default Challenge;
