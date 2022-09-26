import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";


function Channel ({channel, socket, connectedChannel}:{
  channel:ChannelData,
  socket:Socket|undefined,
  connectedChannel:ChannelData|undefined,
}){
  const handleClick = () => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channel.channelId});
  }
  return (
    <div className={("max-w-full truncate text-lg font-semibold self-center py-4 px-10 hover:bg-slate-800 cursor-pointer"+ ((connectedChannel !== undefined && connectedChannel.channelId === channel.channelId) ? ' bg-slate-600':''))}
      onClick={handleClick}>
      {channel.channelName}
    </div>
  )
};

export default Channel
