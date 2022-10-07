import { useState, useEffect } from "react";
import { MenuItem, ControlledMenu, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Socket } from "socket.io-client";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { BlockedUserInterface } from "/shared/interfaces/BlockedUserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import Avatar from "../../../Common/Avatar"

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
import { Api } from "../../../api/api";

const ChannelUserMenu = ({
  pointedUser,
  inputFilter,
  socket,
  menuSettings,
  userPrivilege,
  channelName,
  blockedUserList,
} :{
  pointedUser: ChannelUserInterface;
  inputFilter: string;
  socket: Socket|undefined;
  menuSettings: MenuSettingsType;
  userPrivilege: Privileges;
  channelName: string;
  blockedUserList: BlockedUserInterface[];
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{x:number, y:number}>({ x: 0, y: 0 });
  const [menuProps, toggleMenu] = useMenuState();
  const [imageUrl, setImageUrl] = useState<string>("");
const api = new Api();

  useEffect(() => {
    api.getPicture(pointedUser.pongUsername).then((res) => {
      if (res.status == 200)
        res.blob().then((myBlob) => {
          setImageUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(myBlob);
          });
        });
    });
  }, []);
  const icons = [
    <></>,
    <AiFillTool className="shrink-0"/>,
    <FaCrown className="shrink-0"/>,
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
      ${blockedUserList.find((blockedUser)=>blockedUser.id == pointedUser.id) != undefined ? "hidden":""}`}
    >
      {/* Avatar and Nickname */}
      <div
        className="flex flex-row items-center gap-2"
      >
        <div className="shrink-0">
          <Avatar
            url={imageUrl}
            size="w-10 h-10"
          />
        </div>
        <strong className="shrink truncate">{pointedUser.pongUsername}</strong>
        {icons[pointedUser.privileges]}
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
        <Block socket={socket} user={pointedUser}/>
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
