import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import UserPicture from "../User Picture/UserPicture";
import ChatList from "./ChatList/ChatList";
import TextField from "./TextField/TextField";
import Messages from "./Messages/Messages";
import { ROUTES_BASE } from "../../../shared/websocketRoutes/routes";
import ChannelData from "../../../shared/interfaces/ChannelData";
const ENDPOINT = "http://localhost:8080";

type userType = {
  login: string;
  nickname: string;
  link_to_profile: string;
}
type MessageType = {
  content: string;
  sender: userType;
}

function Chat () {
  const user:userType = {login:'Moot', nickname:'mescande', link_to_profile:'Profile'};
  const [messages, setMessages] = useState<MessageType[]>([])
  const [socket, setSocket] = useState<Socket>();
  const [connectedChannel, setConnectedChannel] = useState<ChannelData | undefined>(undefined);
  const send = (message: string) => {
    socket?.emit(ROUTES_BASE.CHAT.SEND_MESSAGE, {
      channelId: connectedChannel?.channelId,
      message,
    });
  };
  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, []);


  const addMessage = (newElem:MessageType) => {
    setMessages((current_messages)=>{
    return [...current_messages, newElem];
    })
  }
  return (
    <div className="bg-black text-white h-7/8 flex grid grid-cols-5 grid-rows-6 gap-4">
      <ChatList msg={messages[messages.length - 1]}/>
      <Messages messages={messages}/>
      <TextField addMessage={addMessage} />
      <div className="row-start-1 row-span-6 col-start-5">
        <UserPicture />
      </div>
    </div>
  )
}

export default Chat