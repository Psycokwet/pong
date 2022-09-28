import React, { useState } from "react";
import { Menu, MenuItem, MenuButton, ControlledMenu, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { Link } from "react-router-dom";

import { User } from "/shared/interfaces/User";

export type UserMenu = {
  challenge:boolean,
  watch:boolean,
  ban:boolean,
  isOwner:boolean,
  isAdmin:boolean,
}

const Friend = ({friend, input, socket, menu} :{
  friend: User,
  input: string,
  socket: Socket|undefined
  menu: UserMenu
}) => {
  const [anchorPoint, setAnchorPoint] = useState<{x:number, y:number}>({ x: 0, y: 0 });
  const [menuProps, toggleMenu] = useMenuState();

  const SendDm = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_DM, friend.id)
  }
  const Challenge = () => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_CHALLENGE_REQUEST, friend.id)
  }
  const handleClick = () => {
    console.log("Redirect to User Page");
    return (
      <>
      </>
    )
  }
  return (
    <Link
      key={friend.pongUsername}
      onContextMenu={(e) => {
          e.preventDefault();
          setAnchorPoint({ x: e.clientX, y: e.clientY });
          toggleMenu(true);
          socket?.emit(ROUTES_BASE.USER);
      }}
      className={`grid grid-cols-2 grid-flow-col mx-2 cursor-pointer hover:bg-gray-600
      ${friend.pongUsername.startsWith(input) ? "block" : "hidden"}`}
      to={`/profile/${friend.pongUsername}`}
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
          <Link to="/chat" onClick={SendDm}>SendDM</Link>
        </MenuItem>
        <MenuItem className={ menu.challenge ? "" : "hidden" }>
          <Link to="/chat" onClick={Challenge}>Challenge</Link>
        </MenuItem>
        <MenuItem className={ menu.watch ? "" : "hidden" }>
          <Link to="/chat" onClick={SendDm}>Watch</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/chat" onClick={SendDm}>Block</Link>
        </MenuItem>
        <MenuItem className={ menu.isAdmin ? "" : "hidden" }>
          <Link to="/chat" onClick={SendDm}>Mute</Link>
        </MenuItem>
        <MenuItem className={ menu.isAdmin ? "" : "hidden" }>
          <Link to="/chat" onClick={SendDm}>Ban from Channel</Link>
        </MenuItem>
        <MenuItem className={ menu.isOwner ? "" : "hidden" }>
          <Link to="/chat" onClick={SendDm}>Give Admin Rights</Link>
        </MenuItem>
      </ControlledMenu>
    </Link>
  )
}

export default Friend
