import { useEffect } from 'react'
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
    socket?.emit("joinChannelRequest", channelId);
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

  return (
    <div> 
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