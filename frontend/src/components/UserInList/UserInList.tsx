import { useState, useEffect } from "react";
import { MenuItem, ControlledMenu, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Socket } from "socket.io-client";
import { Link } from "react-router-dom";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { UserInterface } from "/shared/interfaces/UserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

import { MenuSettingsType } from "./MenuSettings";
import Watch from "./MenuComponents/Watch";
import AddFriendButton from "./MenuComponents/AddFriendButton";
import Ban from "./MenuComponents/Ban";
import Block from "./MenuComponents/Block";
import Challenge from "./MenuComponents/Challenge";
import Mute from "./MenuComponents/Mute";
import Profile from "./MenuComponents/Profile";
import SendDirectMessage from "./MenuComponents/SendDirectMessage";
import SetAdmin from "./MenuComponents/SetAdmin";
import { Api } from "../../api/api"
import Avatar from "../Common/Avatar";

const api = new Api();

const UserInList = ({user, inputFilter, socket, menuSettings} :{
  user: UserInterface,
  inputFilter: string,
  socket: Socket|undefined
  menuSettings: MenuSettingsType,
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{x:number, y:number}>({ x: 0, y: 0 });
  const [menuProps, toggleMenu] = useMenuState();
  const [userOwnership, setOwnership] = useState<number>(Privileges.MEMBER);
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

  //! call API for pongUsername then call for picture
  const setupOwnership = (val:number) => {
    setOwnership(val);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupOwnership);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupOwnership);
  }}, []);
  if (!user)
    return <></>
  return (
    <div
      key={user.id}
      onContextMenu={(e) => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          toggleMenu(true);
          socket?.emit(ROUTES_BASE.USER);
      }}
      className={`grid grid-cols-2 grid-flow-col mx-2 cursor-pointer hover:bg-gray-600
      ${user.pongUsername.startsWith(inputFilter) ? "block" : "hidden"}`}
    >
      {/* Avatar and Nickname */}
      <div
        className="grid grid-cols-2 m-2"
      >
        <Avatar url={avatarUrl} size="w-20" />
        <strong>{user.pongUsername}</strong>
      </div>
      {/* Right click menu */}
      <ControlledMenu {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <SendDirectMessage socket={socket} user={user}/>
        <Profile user={user}/>
        <Challenge menuSettings={menuSettings} socket={socket} user={user}/>
        <Watch menuSettings={menuSettings}/>
        <AddFriendButton menuSettings={menuSettings} socket={socket} user={user}/>
        <Block />
        <Mute menuSettings={menuSettings} userOwnership={userOwnership} />
        <Ban menuSettings={menuSettings} userOwnership={userOwnership} />
        <SetAdmin menuSettings={menuSettings}/>
      </ControlledMenu>
    </div>
  )
}

export default UserInList
