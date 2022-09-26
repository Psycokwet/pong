import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Channel from "./Channel/Channel";
import UserChat from "./UserChat/UserChat";
import ChannelMenu from "./ChannelMenu";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";

type userType = {
  login: string;
  nickname: string;
//  status: userStatusEnum;
  link_to_profile: string;
}
type MessageType = {
  content: string;
  sender: userType;
}

function ChatList({ msg , socket } : {
    msg: MessageType,
    socket:Socket | undefined,
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


  let DMList = [{name:"user"}, {name:"bis"}, {name:"Johny"}]
  return (
    <div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end">
      <div className="relative">
        <ChannelMenu chanList={chanList} socket={socket}/>
        {chanList.map((chan, i) => {
          return (
            <div key={i}>
              <Channel channel={chan} socket={socket} />
            </div>
          );
        })}
      </div>
      <div className="relative">
        <div className="sticky top-0 px-4 py-3 flex items-center font-semibold text-xl text-slate-200 bg-slate-700/90 backdrop-blur-sm ring-1 ring-black/10">
          DMs
        </div>
        {DMList.map((Chan, i) => {
          return (
            <div key={i}>
              <UserChat name={Chan.name} content={(msg!=undefined ? msg.content:"")} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList
