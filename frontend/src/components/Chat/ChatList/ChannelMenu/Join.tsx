import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";

function Join ({socket} : {
    socket:Socket|undefined,
}){
  const [joinName, setJoinName] = useState<string>("");
  const [joinPass, setJoinPass] = useState<string>("");
  const [selectPass, setSelectPass] = useState<string>("");
  const [publicChanList, setPublicChanList] = useState<ChannelData[]>([]);
  const [selected, setSelected] = useState<string>();

  useEffect(()=> {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_LOBBY_REQUEST);
  }, []);
  const resetChanList = (chans:ChannelData[]) => {
    setPublicChanList(chans);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.LIST_ALL_CHANNELS, resetChanList);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.LIST_ALL_CHANNELS, resetChanList);
    };
  }, [resetChanList]);
  const addChannel = (chan:ChannelData) => {
    setPublicChanList([...publicChanList, chan]);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.NEW_CHANNEL_CREATED, addChannel);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.NEW_CHANNEL_CREATED, addChannel);
    };
  }, [addChannel]);

  const handleClickOnSelect = (name: string | undefined) => {
    socket?.emit(ROUTES_BASE.CHAT.ATTACH_TO_CHANNEL_REQUEST, {channelName: name, inputPassword: selectPass});
    setSelectPass("")
  }
  const handleClickByName = () => {
    socket?.emit(ROUTES_BASE.CHAT.ATTACH_TO_CHANNEL_REQUEST, {channelName: joinName, inputPassword: joinPass});
    setJoinName("")
    setJoinPass("")
  }
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter')
      handleClickByName()
  }
  return (
    <div className="flex flex-col gap-1 text-base font-light">
      <input
        className="bg-slate-600"
        type="text"
        placeholder="Channel Name"
        value={joinName}
        onChange={(e) => {
          setJoinName(e.target.value);
        }}>
      </input>
      <input
        className="bg-slate-600"
        type="text"
        placeholder="Password (optionnal)"
        value={joinPass}
        onChange={(e) => {
          setJoinPass(e.target.value);
        }}>
      </input>
      <button
        className="rounded-xl bg-gray-600 m-2 hover:bg-gray-800"
        onClick={handleClickByName}
      >
        Join
      </button>
      <p>Or</p>
      <select className="bg-slate-600" value={selected} onChange={(e) => setSelected(e.target.value)}>
        { publicChanList.map((chan, i) => {return (
          <option key={i} value={chan.channelName}>{chan.channelName}</option>
        )})}
      </select>
      <input
        className="bg-slate-600"
        type="text"
        placeholder="Password (optionnal)"
        value={selectPass}
        onChange={(e) => {
          setSelectPass(e.target.value);
        }}>
      </input>
      <button
        className="rounded-xl bg-gray-600 m-2 hover:bg-gray-800"
        onClick={()=>handleClickOnSelect(selected)}
      >
        Join
      </button>
    </div>
  );
}

export default Join
