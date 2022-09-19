import { useState, useEffect } from 'react'
import io, { Socket } from "socket.io-client";
import MessageInput from './MessageInput';
import Messages from './Messages';
const ENDPOINT = "http://localhost:8080";

interface ChannelData {
  channelName: string;
  channelId: number;
}

export default function JoinRoomButton(
  {
    socket,
    allChannel,
    setConnectedChannel,
  }:
  {
    socket: Socket | undefined,
    allChannel: ChannelData[],
    setConnectedChannel: any,
  }
  ) {

  // console.log(allChannel)
  const handleClick = (channelId: number) => {
    socket?.emit("joinRoom", channelId);
  }

  const joinRoom = (message: []) => {
    console.log(message)
    setConnectedChannel(message)
  }
  useEffect(()=> {
    socket?.on("joinedRoom", joinRoom);
    return () => {
      socket?.off("joinedRoom", joinRoom);
    };
  }, [joinRoom]);

  return (
    <div> 
      {
        allChannel.map((channel) =>
        <div>
          <button onClick={() => handleClick(channel.channelId)}>Join {channel.channelName}</button>
        </div>
        )
      }
    </div>
  )
}