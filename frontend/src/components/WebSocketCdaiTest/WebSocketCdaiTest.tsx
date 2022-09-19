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
  const [connectedChannel, setConnectedChannel] = useState<ChannelData | undefined>(undefined);
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);

  const send = (message: string) => {
    socket?.emit("send_message", {channelId: connectedChannel?.channelId, message});
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






  
  const getAllChannel = (message: []) => {
    console.log(message)
    setAllChannel(message);
  };
  useEffect(() => {
    socket?.emit("joinChannelLobby");
  }, [socket]);
  
  useEffect(() => {
    socket?.on("allChannel", getAllChannel);
    return () => {
      socket?.off("allChannel", getAllChannel);
    };
  }, [getAllChannel]);




  
  return (
    <>
      <CreateRoom
        socket={socket}
        connectedChannel={connectedChannel}
        setConnectedChannel={setConnectedChannel}
      />
      <JoinRoomButton
        socket={socket}
        allChannel={allChannel}
        setConnectedChannel={setConnectedChannel}
      />
      <MessageInput send={send} />
      <Messages messages={messages} />
    </>
  );
}

export default WebsSocketCdaiTest;
