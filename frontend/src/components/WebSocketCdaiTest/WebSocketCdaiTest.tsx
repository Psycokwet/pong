import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import CreateRoom from "./CreateRoom";
import JoinRoomButton from "./JoinRoomButton";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
const ENDPOINT = "http://localhost:8080";

interface ChannelData {
  channelName: string;
  channelId: number;
}
 

function WebsSocketCdaiTest() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [channelData, setChannelData] = useState<ChannelData | undefined>(undefined);
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);

  const send = (message: string) => {
    socket?.emit("send_message", {channelId: channelData?.channelId, message});
  };
  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      // const newSocket = io(ENDPOINT + '/hat', {
      // path: 'chat',
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, [setSocket]);

  const messageListener = (message: string) => {
    setMessages((current: string[]) => [...current, message]);
  };
  useEffect(() => {
    socket?.on("receive_message", messageListener);
    return () => {
      socket?.off("receive_message", messageListener);
    };
  }, [messageListener]);

  const roomCreationListener = (roomIdFromBack: ChannelData) => {
    console.log(roomIdFromBack);
    setChannelData(roomIdFromBack);
  };
  useEffect(() => {
    socket?.on("createdRoom", roomCreationListener);
    return () => {
      socket?.off("createdRoom", roomCreationListener);
    };
  }, [roomCreationListener]);

  const getAllchannel = (message: string) => {
    setAllChannel(allChannel);
  };
  socket?.emit("joinChannelLobby", getAllchannel);

  return (
    <>
      <CreateRoom
        socket={socket}
        channelData={channelData}
        setChannelData={setChannelData}
      />
      <JoinRoomButton socket={socket} />
      <MessageInput send={send} />
      <Messages messages={messages} />
    </>
  );
}

export default WebsSocketCdaiTest;
