import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { useState } from "react";
import Create from "./Create";
import Join from "./Join";

function ChannelMenu ({ socket }:{
    socket:Socket | undefined,
}){
  const [addChannel, setAddChannel] = useState<boolean>(false)
  const [joinChannel, setJoinChannel] = useState<boolean>(false)
  const [createChannel, setCreateChannel] = useState<boolean>(false)
  return (
    <div className="flex flex-col sticky top-0 px-4 py-3 font-semibold text-xl text-slate-200 bg-slate-700/90 backdrop-blur-sm ring-1 ring-black/10">
      <div
        className={("flex flex-row"+ (addChannel ? ' cursor-pointer':''))}
        onClick={() => {
          setAddChannel(!addChannel);
          setJoinChannel(false);
          setCreateChannel(false)
        }}>
        <h1 className="grow">Channels</h1>
        {addChannel ?
          <FaMinusCircle className="cursor-pointer" onClick={() => setAddChannel(false)}/>
          :
          <FaPlusCircle className="cursor-pointer" onClick={() => setAddChannel(true)}/>
        }
      </div>
      {addChannel ?
        <div className="text-lg font-medium border-gray-500">
          <h1
            className="px-8 cursor-pointer border-inherit border-t-2 border-x-2"
            onClick={()=>{
              setJoinChannel(false);
              setCreateChannel(!createChannel);
          }}>
              Create
          </h1>
          { createChannel ?
            <Create socket={socket}/> : <></>
          }
          <h1
            className={("px-8 cursor-pointer border-inherit border-t-2 border-x-2" + (joinChannel ? "" : " border-b-2"))}
            onClick={()=>{
              setJoinChannel(!joinChannel);
              setCreateChannel(false);
          }}>
            Join
          </h1>
          { joinChannel ?
            <Join socket={socket}/> : <></>
          }
        </div>
          :
        <></>
      }
    </div>
  );
}
export default ChannelMenu
