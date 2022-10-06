import { useState, useEffect } from "react";
import { ControlledMenu, useMenuState } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";

import { MenuSettingsType } from "../UserInList/MenuSettings";
import Watch from "../UserInList/MenuComponents/Watch";
import Challenge from "../UserInList/MenuComponents/Challenge";
import Profile from "../UserInList/MenuComponents/Profile";
import SendDirectMessage from "../UserInList/MenuComponents/SendDirectMessage";
import { Api } from "../../api/api";
import Avatar from "../Common/Avatar";

const api = new Api();

const UserInList = ({
  user,
  inputFilter,
  socket,
  menuSettings,
}: {
  user: UserInterface;
  inputFilter: string;
  socket: Socket | undefined;
  menuSettings: MenuSettingsType;
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [menuProps, toggleMenu] = useMenuState();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    api.getPicture(user.pongUsername).then((res) => {
      if (res.status == 200)
        res.blob().then((myBlob) => {
          setAvatarUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(myBlob);
          });
        });
    });
  }, []);

  return user ? (
    <div
      className={`grid grid-cols-2 grid-flow-col mx-2 cursor-pointer hover:bg-gray-600
      ${user.pongUsername.startsWith(inputFilter) ? "block" : "hidden"}`}
    >
      {/* Avatar and Nickname */}
      <div className="grid grid-cols-2 m-2">
        <Avatar url={avatarUrl} size="w-20" />
        <strong>{user.pongUsername}</strong>
      </div>
      {/* Right click menu */}
      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <SendDirectMessage socket={socket} user={user} />
        <Profile user={user} />
        <Challenge menuSettings={menuSettings} socket={socket} user={user} />
        <Watch menuSettings={menuSettings} />
      </ControlledMenu>
    </div>
  ) : (
    <></>
  );
};

export default UserInList;
