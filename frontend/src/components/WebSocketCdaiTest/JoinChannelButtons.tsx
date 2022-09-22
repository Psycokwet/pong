import { useEffect } from 'react'
import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";

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
    socket?.emit("joinChannelRequest", {roomId: channelId, userPassword: privatePass});
			setPrivateName("")
			setPrivatePass("")
  }
  const handleJoinChannel = (message: ChannelData) => {
    console.log(message)
    setConnectedChannel(message)
  }
  useEffect(()=> {
    socket?.on("confirmChannelEntry", handleJoinChannel);
    return () => {
      socket?.off("confirmChannelEntry", handleJoinChannel);
    };
  }, [handleJoinChannel]);

  const [privateName, setPrivateName] = useState<string>("");
  const [privatePass, setPrivatePass] = useState<string>("");
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter') {
			socket?.emit("joinPrivateChannelRequest", {roomName: privateName, userPassword: privatePass});
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
        value={privatePass}
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
  )
}