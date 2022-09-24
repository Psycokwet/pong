import React from "react"
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";


function Channel ({channel, socket}:{
  channel:ChannelData,
  socket:Socket|undefined
}){
  const handleClick = () => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channel.channelId});
  }
  return (
    <div className="max-w-full truncate text-lg font-semibold self-center py-4 px-10 hover:bg-slate-800 cursor-pointer"
      onClick={handleClick}>
      {channel.channelName}
    </div>
  )
};

export default Channel
