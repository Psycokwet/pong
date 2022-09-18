import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import CreateRoom from "./CreateRoom";
import JoinRoomButton from "./JoinRoomButton";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
const ENDPOINT = "http://localhost:8080";

function WebsSocketCdaiTest() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [roomName, setRoomName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');

  const send = (value: string) => {
    socket?.emit("send_message", value);
  }
  useEffect(() => {
    const newSocket = io(
      ENDPOINT,
      {
        // const newSocket = io(ENDPOINT + '/hat', {
        // path: 'chat',
        transports: ['websocket'],
        withCredentials: true,
      });
    setSocket(newSocket)
  }, [setSocket]);

  const messageListener = (message: string) => {
    setMessages([...messages, message])
  }
  useEffect(() => {
    socket?.on('receive_message', messageListener)
    return () => {
      socket?.off('receive_message', messageListener)
    }
  }, [messageListener])

  const roomCreationListener = (roomIdFromBack: string) => {
    console.log(roomIdFromBack)
    setRoomId(roomIdFromBack)
  }
  useEffect(() => {
    socket?.on('createdRoom', roomCreationListener)
    return () => {
      socket?.off('createdRoom', roomCreationListener)
    }
  }, [roomCreationListener])

  return (
    <>
      <CreateRoom
        roomName={roomName}
        socket={socket}
        setRoomName={setRoomName}
        roomId={roomId}
        // roomName={roomName}
      />
      {/* <JoinRoomButton socket={socket} /> */}
      <MessageInput send={send} />
      <Messages messages={messages} />
    </>
  );
}

export default WebsSocketCdaiTest;