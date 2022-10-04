import React, { useEffect, useState } from "react";
import Avatar from "../../../Common/Avatar";
import { Api } from "../../../../api/api";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { Message } from "/shared/interfaces/Message";

const api = new Api();

type Props = {
  socket: Socket|undefined;
  channel: ChannelData;
  // message: Message
  connectedChannel: ChannelData|undefined
};

const DirectMessage: React.FC<Props> = ({
  socket, 
  channel, 
  // message, 
  connectedChannel
}) => {
  // const [lastMessage, setLastMessage] = useState<Message>();
  const [avatarUrl, setAvatarUrl] = useState("");
  const handleClick = () => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channel.channelId});
  }

  let style:string = "flex flex-row gap-4 text-lg font-semibold py-4 px-10 hover:bg-slate-800 cursor-pointer display-block break-all";
  if (connectedChannel !== undefined && connectedChannel.channelId === channel.channelId)
    style=style + " bg-slate-600";

  // if (message.roomId === channel.channelId && lastMessage !== message)
  //   setLastMessage(message);
  useEffect(() => {
    api.getPicture(channel.channelName).then((res) => {
      if (res.status == 200)
        res.blob().then((myBlob) => {
          setAvatarUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(myBlob);
          });
        });
    });
  }, []);

  return (
    <div className={style}
      onClick={handleClick}>
      <Avatar url={avatarUrl} size="w-12 h-12"/>
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold truncate">
          {channel.channelName}
        </h4>
        {/* <p className="text-sm font-normal truncate text-gray-300 max-w-full">
          {lastMessage?.content}
        </p> */}
      </div>
    </div>
  )
};

export default DirectMessage
