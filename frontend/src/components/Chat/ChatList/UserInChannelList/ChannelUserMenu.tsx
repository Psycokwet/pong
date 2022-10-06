import { useState } from "react";
import { ControlledMenu, useMenuState } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { Socket } from "socket.io-client";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
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
import { MenuSettingsType } from "../../../UserInList/MenuSettings";

const ChannelUserMenu = ({
  user,
  inputFilter,
  socket,
  menuSettings,
  userPrivilege,
}: {
  user: ChannelUserInterface;
  inputFilter: string;
  socket: Socket | undefined;
  menuSettings: MenuSettingsType;
  userPrivilege: Privileges;
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [menuProps, toggleMenu] = useMenuState();

  const icons = [<></>, <AiFillTool />, <FaCrown />];

  if (!user) return <></>;
  return (
    <div
      key={user.id}
      onContextMenu={(e) => {
        e.preventDefault();
        setAnchorPoint({ x: e.clientX, y: e.clientY });
        toggleMenu(true);
      }}
      className={`grid grid-cols-2 grid-flow-col mx-2 cursor-pointer hover:bg-gray-600
      ${user.pongUsername.startsWith(inputFilter) ? "block" : "hidden"}`}
    >
      {/* Avatar and Nickname */}
      <div className="grid grid-cols-3 m-2">
        <img src={user.image_url} alt="Avatar" className="w-10 rounded-3xl" />
        <strong>{user.pongUsername}</strong>
        {icons[user.privileges]}
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
        <AddFriendButton
          menuSettings={menuSettings}
          socket={socket}
          user={user}
        />
        <Block />
        <Mute menuSettings={menuSettings} userPrivilege={userPrivilege} />
        <Ban menuSettings={menuSettings} userPrivilege={userPrivilege} />
        <SetAdmin menuSettings={menuSettings} />
      </ControlledMenu>
    </div>
  );
};

export default ChannelUserMenu;
