import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";

export default function CreateChannel({
  handleCreateRoom,
} : {
  handleCreateRoom: (newChannelName: string) => void 
})
{
  const [tempRoomName, setTempRoomName] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter') {
      handleCreateRoom(tempRoomName)
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Room's name"
        value={tempRoomName}
        onChange={(e) => {
          setTempRoomName(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      <button onClick={() => handleCreateRoom(tempRoomName)}>Create room</button>
    </div>
  );
}
