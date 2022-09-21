import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import CreateChannel from "./CreateChannel";
import JoinChannelButtons from "./JoinChannelButtons";
import LeaveChannelButton from "./LeaveChannelButton";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
const ENDPOINT = "http://localhost:8080";
import { ROUTES_BASE } from "../../../shared/websocketRoutes/routes";
import ChannelData from "../../../shared/interface/ChannelData";
 
function WebsSocketCdaiTest() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedChannel, setConnectedChannel] = useState<ChannelData | undefined>(undefined);
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);

  /** MESSAGE */
  const send = (message: string) => {
    socket?.emit(ROUTES_BASE.CHAT.SEND_MESSAGE, {channelId: connectedChannel?.channelId, message});
  };
  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, [setSocket]);

  const messageListener = (message: string) => {
    setMessages((current: string[]) => [...current, message]);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, messageListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, messageListener);
    };
  }, [messageListener]);
  /** END MESSAGE */

  /** CREATE CHANNEL */
  const handleCreateChannel = (newChannelName: string) => {
    socket?.emit(ROUTES_BASE.CHAT.CREATE_CHANNEL_REQUEST, newChannelName);
  };
  const channelCreationListener = (confirmedConnectedChannel: ChannelData) => {
    setConnectedChannel(confirmedConnectedChannel);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, channelCreationListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, channelCreationListener);
    };
  }, [channelCreationListener]);
  /** END CREATE CHANNEL */



  /** JOIN CHANNEL */
  const handleJoinChannelClick = (channelId: number) => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNE_REQUEST, channelId);
  }
  const handleJoinChannel = (message: ChannelData) => {
    setConnectedChannel(message)
  }
  useEffect(()=> {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, handleJoinChannel);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, handleJoinChannel);
    };
  }, [handleJoinChannel]);
  /** END JOIN CHANNEL */
  
  
  
  /** GET ALL CHANNEL */
  useEffect(() => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_LOBBY_REQUEST);
  }, [socket]);
  const getAllChannel = (message: []) => {
    setAllChannel(message);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.LIST_ALL_CHANNELS, getAllChannel);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.LIST_ALL_CHANNELS, getAllChannel);
    };
  }, [getAllChannel]);
  /** END GET ALL CHANNEL */





  /** DISCONNECT CHANNEL */
  const sendDisconnect = () => {
    socket?.emit(ROUTES_BASE.CHAT.DISCONNECT_FROM_CHANNEL_REQUEST, connectedChannel?.channelId);
  }
  const handleDisconnect = () => {
    setConnectedChannel(undefined);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, handleDisconnect);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, handleDisconnect);
    };
  }, [handleDisconnect]);
  /** DISCONNECT CHANNEL */





  
  return (
    <>
      {
        !connectedChannel ?
        <>
          <CreateChannel
            handleCreateChannel={handleCreateChannel}
          />
          <JoinChannelButtons
            allChannel={allChannel}
            handleClick={handleJoinChannelClick}
          />
        </>
        :
        <>
          <h4>Channel Id: {connectedChannel?.channelId}</h4>
          <h4>Channel Name: {connectedChannel?.channelName}</h4>
          <LeaveChannelButton
            channelName={connectedChannel.channelName}
            sendDisconnect={sendDisconnect}
          />
          <MessageInput send={send} />
          <Messages messages={messages} />
        </>
      }
    </>
  );
}

export default WebsSocketCdaiTest;
