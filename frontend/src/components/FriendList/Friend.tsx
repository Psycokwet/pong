import { useState, useEffect } from "react";
import { MenuItem, ControlledMenu, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { Link } from "react-router-dom";

import { UserInterface } from "/shared/interfaces/UserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

export type MenuSettingsType = {
  challenge:boolean,
  watch:boolean,
  privileges:number,
  friend:boolean,
}

const Friend = ({friend, inputFilter, socket, menuSettings} :{
  friend: UserInterface,
  inputFilter: string,
  socket: Socket|undefined
  menuSettings: MenuSettingsType,
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{x:number, y:number}>({ x: 0, y: 0 });
  const [menuProps, toggleMenu] = useMenuState();
  const [userOwnership, setOwnership] = useState<number>(Privileges.MEMBER);

  const sendDirectMessage = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_DM, friend.id)
  }
  const challenge = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_CHALLENGE_REQUEST, friend.id)
  }
  const mute = () => {
  }
  const ban = () => {
  }
  const setAdmin = () => {
  }
  const addFriend = () => {
    socket?.emit(ROUTES_BASE.USER.ADD_FRIEND_REQUEST, friend.pongUsername);
  }
  const setupOwnership = (val:number) => {
    setOwnership(val);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupOwnership);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupOwnership);
  }}, []);
  return (
    <div
      key={friend.pongUsername}
      onContextMenu={(e) => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          toggleMenu(true);
          socket?.emit(ROUTES_BASE.USER);
      }}
      className={`grid grid-cols-2 grid-flow-col mx-2 cursor-pointer hover:bg-gray-600
      ${friend.pongUsername.startsWith(inputFilter) ? "block" : "hidden"}`}
    >
      {/* Avatar and Nickname */}
      <div
        className="grid grid-cols-2 m-2"
      >
        <img
          src={friend.image_url}
          alt="Avatar"
          className="w-10 rounded-3xl"
        />
        <strong>{friend.pongUsername}</strong>
      </div>
      {/* Right click menu */}
      <ControlledMenu {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => toggleMenu(false)}
      >
        <MenuItem>
          <Link to={`/profile/${friend.pongUsername}`}>SeeProfile</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/chat" onClick={sendDirectMessage}>Send a Direct Message</Link>
        </MenuItem>
        <MenuItem className={ menuSettings.challenge ? "" : "hidden" }>
          <Link to="/play" onClick={challenge}>Challenge</Link>
        </MenuItem>
        <MenuItem className={ menuSettings.watch ? "" : "hidden" }>
          <Link to="/play">Watch</Link>
        </MenuItem>
        <MenuItem className={ menuSettings.friend ? "hidden" : "" }>
          <div onClick={addFriend}>Add as Friend</div>
        </MenuItem>
        <MenuItem>
          <div>Block</div>
        </MenuItem>
        <MenuItem className={ menuSettings.privileges === Privileges.MEMBER ? "hidden" : "" }
          disabled={ userOwnership >= menuSettings.privileges }
        >
          <div onClick={mute}>Mute</div>
        </MenuItem>
        <MenuItem className={ menuSettings.privileges === Privileges.MEMBER ? "hidden" : "" }
          disabled={ userOwnership >= menuSettings.privileges }
        >
          <div onClick={ban}>Ban from Channel</div>
        </MenuItem>
        <MenuItem className={ menuSettings.privileges === Privileges.OWNER ? "" : "hidden" }>
          <div onClick={setAdmin}>Give Admin Rights</div>
        </MenuItem>
      </ControlledMenu>
    </div>
  )
}

export default Friend
