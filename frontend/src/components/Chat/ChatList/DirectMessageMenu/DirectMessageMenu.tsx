import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { KeyboardEvent, useState } from "react";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

function DirectMessageMenu ({ socket }:{
    socket:Socket | undefined,
}){
  const [addChannel, setAddChannel] = useState<boolean>(false)
  const [user, setUser] = useState<string>("")
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter')
      handleClick();
  }
  const handleClick = () => {
    if (user.trim() !== "") {
      socket?.emit(ROUTES_BASE.CHAT.CREATE_DM, user);
    }
    setUser("")
  }
  return (
    <div className="flex flex-col sticky top-0 px-4 py-3 font-semibold text-xl text-slate-200 bg-slate-700/90 backdrop-blur-sm ring-1 ring-black/10">
      <div className={("flex flex-row"+ (addChannel ? ' cursor-pointer':''))}
        onClick={() => {
          setAddChannel(!addChannel);}
        }>
        <h1 className="grow">Direct Messages</h1>
        {addChannel ?
          <FaMinusCircle className="cursor-pointer" onClick={() => setAddChannel(false)}/>
          :
          <FaPlusCircle className="cursor-pointer" onClick={() => setAddChannel(true)}/>
        }
      </div>
      {addChannel ?
          <div className="flex flex-col gap-1 text-base font-light">
            <input
              className="bg-slate-600"
              type="text"
              placeholder="User Name"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            ></input>
            <button
              className={`rounded-xl bg-gray-600 m-2 hover:bg-gray-800`}
              onClick={handleClick}
            >
              Create
            </button>
          </div>
        :
      <></>
      }
    </div>
  );
}
export default DirectMessageMenu
