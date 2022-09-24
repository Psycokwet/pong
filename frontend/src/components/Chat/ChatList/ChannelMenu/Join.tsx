import { useState } from "react";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";

function Join ({socket, chanList} : {
    socket:Socket|undefined,
    chanList:ChannelData[],
}){
  const [joinName, setJoinName] = useState<string>("");
  const [joinPass, setJoinPass] = useState<string>("");
  const [selectPass, setSelectPass] = useState<string>("");
  let selected:ChannelData;
  const handleClickSelect = (channelId: number) => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channelId, userPassword: selectPass});
    setSelectPass("")
  }
  const handleClickByName = () => {
    socket?.emit(ROUTES_BASE.CHAT.SEARCH_CHANNEL_REQUEST, {ChannelName: joinName, inputPassword: joinPass});
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
              placeholder="Serveur Name"
              value={joinName}
              onChange={(e) => {
                setJoinName(e.target.value);
              }}
            ></input>
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Password (optionnal)"
              value={joinPass}
              onChange={(e) => {
                setJoinPass(e.target.value);
              }}
            ></input>
            <button
              className={`rounded-xl bg-gray-600 m-2 hover:bg-gray-800`}
              onClick={handleClickByName}
            >
              Join
            </button>
            <p>Or</p>
            <select className="bg-slate-600" value={selected}>
              <option disabled selected hidden>Select Public Channel</option>
              { chanList.map((chan, i) => {return (
                <option key={i} value={chan}>{chan.channelName}</option>
              )})}
            </select>
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Password (optionnal)"
              value={selectPass}
              onChange={(e) => {
                setSelectPass(e.target.value);
              }}
            ></input>
            <button
              className={`rounded-xl bg-gray-600 m-2 hover:bg-gray-800`}
              onClick={()=>handleClickSelect(selected.channelId)}
            >
              Join
            </button>
          </div>
  );
}

export default Join
