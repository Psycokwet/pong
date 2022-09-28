import { useState, useEffect } from "react";
import { MenuItem, ControlledMenu, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { Link } from "react-router-dom";

import { UserInterface } from "/shared/interfaces/UserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

export type UserMenu = {
  challenge:boolean,
  watch:boolean,
  privileges:number,
  friend:boolean,
}

const Friend = ({friend, input, socket, menu} :{
  friend: UserInterface,
  input: string,
  socket: Socket|undefined
  menu: UserMenu
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{x:number, y:number}>({ x: 0, y: 0 });
  const [menuProps, toggleMenu] = useMenuState();
  const [userOwnership, setOwnership] = useState<number>(Privileges.MEMBER);

  const SendDirectMessage = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_DM, friend.id)
  }
  const Challenge = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_CHALLENGE_REQUEST, friend.id)
  }
  const Mute = () => {
  }
  const Ban = () => {
  }
  const SetAdmin = () => {
  }
  const AddFriend = () => {
    socket?.emit(ROUTES_BASE.USER.ADD_FRIEND_REQUEST, friend.pongUsername);
  }
  const SetupOwnership = (val:number) => {
    setOwnership(val);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, SetupOwnership);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, SetupOwnership);
  }}, []);
  const handleClick = () => {
    console.log("Redirect to User Page");
    return (
      <>
      </>
    )
  }
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
      ${friend.pongUsername.startsWith(input) ? "block" : "hidden"}`}
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
          <Link to="/chat" onClick={SendDirectMessage}>Send a Direct Message</Link>
        </MenuItem>
        <MenuItem className={ menu.challenge ? "" : "hidden" }>
          <Link to="/play" onClick={Challenge}>Challenge</Link>
        </MenuItem>
        <MenuItem className={ menu.watch ? "" : "hidden" }>
          <Link to="/play">Watch</Link>
        </MenuItem>
        <MenuItem className={ menu.friend ? "hidden" : "" }>
          <div onClick={AddFriend}>Add as Friend</div>
        </MenuItem>
        <MenuItem>
          <div>Block</div>
        </MenuItem>
        <MenuItem className={ menu.privileges === Privileges.MEMBER ? "hidden" : "" }
          disabled={ userOwnership > menu.privileges }
        >
          <div onClick={Mute}>Mute</div>
        </MenuItem>
        <MenuItem className={ menu.privileges === Privileges.MEMBER ? "hidden" : "" }
          disabled={ userOwnership > menu.privileges }
        >
          <div onClick={Ban}>Ban from Channel</div>
        </MenuItem>
        <MenuItem className={ menu.privileges === Privileges.OWNER ? "" : "hidden" }>
          <div onClick={SetAdmin}>Give Admin Rights</div>
        </MenuItem>
      </ControlledMenu>
    </div>
  )
}

export default Friend
