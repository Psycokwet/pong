import { ROUTES_BASE } from "../../../shared/websocketRoutes/routes";
import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";

function CreateDm (
  {handleCreateDM} : {handleCreateDM: (newDmName:string) => void}
) {
  const [socket, setSocket] = useState<Socket>();
  const [dmName, setDmName]= useState<string>(""); 
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Enter" && dmName !== ""){
      handleCreateDM(dmName);
      setDmName("");
      }
  };
  return (
    <>
      <input
        type="text"
        placeholder="DM's Id"
        value={dmName}
        onChange={(e) => {
          setDmName(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      <button onClick={() => {handleCreateDM(dmName); setDmName("");}}>
        Create DM
      </button>
    </>
  )
}

export default CreateDm
