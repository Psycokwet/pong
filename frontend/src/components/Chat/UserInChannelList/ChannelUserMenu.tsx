import { useState, useEffect } from "react";
import { MenuItem, ControlledMenu, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

import { MenuSettingsType } from "./MenuSettings";
import Watch from "/src/components/UserInList/MenuComponents/Watch";
import AddFriendButton from "/src/components/UserInList/MenuComponents/AddFriendButton";
import Ban from "/src/components/UserInList/MenuComponents/Ban";
import Block from "/src/components/UserInList/MenuComponents/Block";
import Challenge from "/src/components/UserInList/MenuComponents/Challenge";
import Mute from "/src/components/UserInList/MenuComponents/Mute";
import Profile from "/src/components/UserInList/MenuComponents/Profile";
import SendDirectMessage from "/src/components/UserInList/MenuComponents/SendDirectMessage";
import SetAdmin from "/src/components/UserInList/MenuComponents/SetAdmin";
import { FaCrown } from "react-icons/fa";
import { AiFillTool } from "react-icons/ai";

const ChannelUserMenu = ({pointedUser, inputFilter, socket, menuSettings, userPrivilege, channelName} :{
  pointedUser: ChannelUserInterface,
  inputFilter: string,
  socket: Socket|undefined
  menuSettings: MenuSettingsType,
  userPrivilege: Privileges;
  channelName: string
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{x:number, y:number}>({ x: 0, y: 0 });
  const [menuProps, toggleMenu] = useMenuState();

  const icons = [
    <></>,
    <AiFillTool/>,
    <FaCrown/>,
  ]

  if (!pointedUser)
    return <></>
  return (
    <div
      key={pointedUser.id}
      onContextMenu={(e) => {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        toggleMenu(true);
        socket?.emit(ROUTES_BASE.USER);
      }}
      className={`mx-2 cursor-pointer hover:bg-gray-600
      ${pointedUser.pongUsername.startsWith(inputFilter) ? "block" : "hidden"}`}
    >
      {/* Avatar and Nickname */}
      <div className="p-1">
        {icons[pointedUser.privileges]}
        <strong>{pointedUser.pongUsername}</strong>
      </div>
      {/* Right click menu */}
      <ControlledMenu {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <SendDirectMessage socket={socket} user={pointedUser}/>
        <Profile user={pointedUser}/>
        <Challenge menuSettings={menuSettings} socket={socket} user={pointedUser}/>
        <Watch menuSettings={menuSettings}/>
        <AddFriendButton menuSettings={menuSettings} socket={socket} user={pointedUser}/>
        <Block />
        <Mute
          userPrivilege={userPrivilege}
          user={pointedUser}
          socket={socket}
          channelName={channelName}
        />
        <Ban
          userPrivilege={userPrivilege}
          user={pointedUser}
          socket={socket}
          channelName={channelName}
        />
        <SetAdmin
          userPrivilege={userPrivilege}
          pointedUser={pointedUser}
          socket={socket}
          channelName={channelName}
        />
      </ControlledMenu>
    </div>
  )
}

export default ChannelUserMenu
