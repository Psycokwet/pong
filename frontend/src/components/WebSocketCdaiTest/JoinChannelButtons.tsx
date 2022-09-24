import { useEffect } from 'react'
import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "../../../shared/websocketRoutes/routes";

interface ChannelData {
  channelName: string;
  channelId: number;
}

export default function JoinChannelButtons(
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
  const handleClick = (channelId: number) => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channelId, userPassword: privatePass});
			setPrivateName("")
			setPrivatePass("")
  }
  const handleJoinChannel = (message: ChannelData) => {
    console.log(message)
    setConnectedChannel(message)
  }
  useEffect(()=> {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, handleJoinChannel);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, handleJoinChannel);
    };
  }, [handleJoinChannel]);

  const [privateName, setPrivateName] = useState<string>("");
  const [privatePass, setPrivatePass] = useState<string>("");
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter') {
			socket?.emit(ROUTES_BASE.CHAT.SEARCH_CHANNEL_REQUEST, {ChannelName: privateName, inputPassword: privatePass});
			setPrivateName("")
			setPrivatePass("")
		}
  }

  return (
    <div> 
      <input
        type="text"
        placeholder="join private"
        value={privateName}
        onChange={(e) => {
          setPrivateName(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      <input
        type="text"
        placeholder="private password"
        value={privatePass}channelName
        onChange={(e) => {
          setPrivatePass(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      {
        allChannel.map(
          (channel) =>
            <div key={channel.channelId} >
              <button onClick={() => handleClick(channel.channelId)}>Join {channel.channelName}/id: {channel.channelId}</button>
            </div>
        )
      }
    </div>
  );
}
