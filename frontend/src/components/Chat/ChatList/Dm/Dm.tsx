import React, { useEffect, useState } from "react";
import UserPicture from "../../../User Picture/UserPicture";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { Message } from "/shared/interfaces/Message";

type Props = {
  socket: Socket|undefined;
  channel: ChannelData;
  message: Message
  connectedChannel: ChannelData|undefined
};

const Dm: React.FC<Props> = ({socket, channel, message, connectedChannel}) => {
  const [lastMessage, setLastMessage] = useState<Message>();
  const handleClick = () => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channel.channelId});
  }
  if (connectedChannel !== undefined && connectedChannel.channelId === channel.channelId)
    setLastMessage(message);

  return (
    <div className={("max-w-full truncate text-lg font-semibold self-center py-4 px-10 hover:bg-slate-800 cursor-pointer"+ ((connectedChannel !== undefined && connectedChannel.channelId === channel.channelId) ? ' bg-slate-600':''))}
      onClick={handleClick}>
      <UserPicture width="50px"/>
      <div className="max-width-full">
        <div className="max-w-full truncate text-lg font-semibold self-center">
          {channel.channelName}
        </div>
        <div className="max-w-full truncate text-sm">
          {lastMessage}
        </div>
      </div>
    </div>
  )
};

export default Dm
