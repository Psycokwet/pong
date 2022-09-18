import { useState} from 'react'
const ENDPOINT = "http://localhost:8080";

export default function CreateRoom(
  {
    socket,
    setRoomName,
  }
  // :
  // {
  //   socket: Socket | undefined,
  //   // roomName: string,
  //   Dispatch<SetStateAction<string>>,
  // }
) {
  const [tempRoomName, setTempRoomName] = useState<string>('')

  const handleCreateRoom = () => {
    socket?.emit("createRoom", tempRoomName);
    setRoomName(tempRoomName)
  }

  return (
    <div>
      <input type='text' placeholder="Room's name" value={tempRoomName} onChange={(e) => { setTempRoomName(e.target.value) }}></input>
      <button onClick={handleCreateRoom}>Create room</button>
    </div>
  )
}