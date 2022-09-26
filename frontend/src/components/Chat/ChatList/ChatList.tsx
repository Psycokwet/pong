import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Channel from "./Channel/Channel";
import Dm from "./Dm/Dm";
import ChannelMenu from "./ChannelMenu/ChannelMenu";
import DmMenu from "./DmMenu/DmMenu";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { Message } from "/shared/interfaces/Message";

function ChatList({ msg , socket , connectedChannel} : {
    msg: Message,
    socket:Socket | undefined,
    connectedChannel: ChannelData | undefined,
}){
  const [chanList, setChanList] = useState<ChannelData[]>([]);
  const [dmList, setDmList] = useState<ChannelData[]>([]);

  useEffect(()=> {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_ATTACHED_CHANNEL_LOBBY_REQUEST);
  }, []);
  useEffect(()=> {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_DM_CHANNEL_LOBBY_REQUEST);
  }, []);

  const resetChanList = (chans:ChannelData[]) => {
    setChanList(chans);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.LIST_ALL_ATTACHED_CHANNELS, resetChanList);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.LIST_ALL_ATTACHED_CHANNELS, resetChanList);
    };
  }, [resetChanList]);

  const resetDmList = (chans:ChannelData[]) => {
    setDmList(chans);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS, resetDmList);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS, resetDmList);
    };
  }, [resetDmList]);


  return (
    <div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end">
      <div className="relative">
        <ChannelMenu socket={socket}/>
        {chanList.map((chan, i) => {
          return (
            <div key={i}>
              <Channel
                channel={chan}
                socket={socket}
                connectedChannel={connectedChannel}
              />
            </div>
          );
        })}
      </div>
      <div className="relative">
        <DmMenu socket={socket}/>
        {dmList.map((chan, i) => {
          return (
            <div key={i}>
              <Dm
                socket={socket}
                channel={chan}
                message={msg==undefined?"":msg}
                connectedChannel={connectedChannel}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList
