import { useState, useEffect } from 'react'
import io, { Socket } from "socket.io-client";
import MessageInput from './MessageInput';
import Messages from './Messages';
const ENDPOINT = "http://localhost:8080";

export default function JoinRoomButton(
  {
    socket,
  }:
  {
    socket: Socket | undefined,
  }
  ) {
    const handleClick = () => {
      socket?.emit("joinRoom");
    }

  return (
    <div>
      <button onClick={handleClick}>JOIN TEST</button>
    </div>
  )
}