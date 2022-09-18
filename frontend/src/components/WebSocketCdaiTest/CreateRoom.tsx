import { useEffect, useState} from 'react'
const ENDPOINT = "http://localhost:8080";

export default function CreateRoom(
  {
    roomName,
    socket,
    setRoomName,
    roomId,
    // setRoomId,
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
      <h4>RoomId: {roomId}</h4>
      <h4>Room Name: {roomName}</h4>
      <button onClick={handleCreateRoom}>Create room</button>
    </div>
  )
}