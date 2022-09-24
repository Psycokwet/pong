import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";

function Create ({socket}:{socket:Socket|undefined})  {
  const [newChanName, setNewChanName] = useState<string>("");
  const [newChanPass, setNewChanPass] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const handleCreateChannel = ({name, isPriv, pass} : {
    name: string;
    isPriv: boolean
    pass: string;
  }) => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_CHANNEL_REQUEST, {
      channelName: name,
      isChannelPrivate: isPriv,
      password: pass,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter')
      handleClick();
  }
  const handleClick = () => {
    if (newChanName.trim() !== "")
      handleCreateChannel({name:newChanName, isPriv:isPrivate, pass:newChanPass})
    setNewChanName("")
    setNewChanPass("")
    setIsPrivate(false)
  }
  return (
    <>
          <div className="flex flex-col gap-1 text-base font-light">
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Serveur Name"
              value={newChanName}
              onChange={(e) => {
                setNewChanName(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            ></input>
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Password (optionnal)"
              value={newChanPass}
              onChange={(e) => {
                setNewChanPass(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            ></input>
            <div className="flex flex-row gap-4 px-6">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => { setIsPrivate(e.target.checked) }}></input>
              <h3>Private</h3>
            </div>
            <button
              className={`rounded-xl bg-gray-600 m-2 hover:bg-gray-800`}
              onClick={handleClick}
            >
              Create
            </button>
          </div>
    </>
  )
}

export default Create
