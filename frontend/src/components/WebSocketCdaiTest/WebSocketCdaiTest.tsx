import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import ChannelAttachedUsers from "./ChannelAttachedUsers";
import CreateChannel from "./CreateChannel";
import JoinChannelButtons from "./JoinChannelButtons";
import LeaveChannelButton from "./LeaveChannelButton";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
const ENDPOINT = "http://localhost:8080";

interface ChannelData {
  channelName: string;
  channelId: number;
}

interface User {
  id: number;
  pongUsername: string;
}

function WebsSocketCdaiTest() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedChannel, setConnectedChannel] = useState<ChannelData | undefined>(undefined);
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);
  const [channelAttachedUserList, setChannelAttachedUserList] = useState<User[]>([]);

  /** CHANNEL ATTACHED USER LIST */
  const handleChannelAttachedUserList = (channelAttachedUserList: User[]) => {
    setChannelAttachedUserList(channelAttachedUserList);
  };
  useEffect(() => {
    socket?.on("updateChannelAttachedUserList", handleChannelAttachedUserList);
    return () => {
      socket?.off("updateChannelAttachedUserList", handleChannelAttachedUserList);
    };
  }, [handleChannelAttachedUserList]);
  /** END CHANNEL ATTACHED USER LIST */

  /** MESSAGE */
  const send = (message: string) => {
    socket?.emit("sendMessage", {channelId: connectedChannel?.channelId, message});
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
    socket?.on("receiveMessage", messageListener);
    return () => {
      socket?.off("receiveMessage", messageListener);
    };
  }, [messageListener]);
  /** END MESSAGE */

  /** CREATE CHANNEL */
  const handleCreateChannel = (newChannelName: string) => {
    socket?.emit("createChannelRequest", newChannelName);
  };
  const channelCreationListener = (confirmedConnectedChannel: ChannelData) => {
    setAllChannel([...allChannel, confirmedConnectedChannel]);
  };
  useEffect(() => {
    socket?.on("confirmChannelCreation", channelCreationListener);
    return () => {
      socket?.off("confirmChannelCreation", channelCreationListener);
    };
  }, [channelCreationListener]);
  /** END CREATE CHANNEL */



  /** JOIN CHANNEL */

  const handleClick = (channelId: number) => {
    socket?.emit("joinChannelRequest", channelId);
  };
  const handleJoinChannel = (message: ChannelData) => {
    setConnectedChannel(message);
  };
  useEffect(() => {
    socket?.on("confirmChannelEntry", handleJoinChannel);
    return () => {
      socket?.off("confirmChannelEntry", handleJoinChannel);
    };
  }, [handleJoinChannel]);
  /** END JOIN CHANNEL */
  
  
  
  /** GET ALL CHANNEL */
  useEffect(() => {
    socket?.emit("joinChannelLobbyRequest");
  }, [socket]);
  const getAllChannel = (message: []) => {
    setAllChannel(message);
  };
  useEffect(() => {
    socket?.on("listAllChannels", getAllChannel);
    return () => {
      socket?.off("listAllChannels", getAllChannel);
    };
  }, [getAllChannel]);
  /** END GET ALL CHANNEL */





  /** DISCONNECT CHANNEL */
  const sendDisconnect = () => {
    socket?.emit('disconnectFromChannelRequest', connectedChannel?.channelId);
  }
  const handleDisconnect = () => {
    setConnectedChannel(undefined);
    setChannelAttachedUserList([]);
  };
  useEffect(() => {
    socket?.on("confirmChannelDisconnection", handleDisconnect);
    return () => {
      socket?.off("confirmChannelDisconnection", handleDisconnect);
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
            socket={socket}
            allChannel={allChannel}
            setConnectedChannel={setConnectedChannel}
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
          <ChannelAttachedUsers channelAttachedUserList={channelAttachedUserList} />
          <MessageInput send={send} />
          <Messages messages={messages} />
        </>
      }
    </>
  );
}

export default WebsSocketCdaiTest;
