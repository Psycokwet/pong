import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import ConnectedUsers from "./ConnectedUsers";
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
 

function WebsSocketCdaiTest() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedChannel, setConnectedChannel] = useState<ChannelData | undefined>(undefined);
  const [connectedUserIdList, setConnectedUserIdList] = useState<number[]>([]);
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);

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
  }, []);

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
    console.log(confirmedConnectedChannel);
    setConnectedChannel(confirmedConnectedChannel);
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
  }
  const handleJoinChannel = (message: ChannelData) => {
    console.log(message)
    setConnectedChannel(message)
  }
  useEffect(()=> {
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
    console.log(message)
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
    socket?.emit('disconnectFromChannel', connectedChannel?.channelId);
  }
  const handleDisconnect = () => {
    setConnectedChannel(undefined);
  };
  useEffect(() => {
    socket?.on("confirmChannelDisconnection", handleDisconnect);
    return () => {
      socket?.off("confirmChannelDisconnection", handleDisconnect);
    };
  }, [handleDisconnect]);
  /** DISCONNECT CHANNEL */


  /** CONNECTED USER LIST */
  const handleUpdateConnectedUserIdList = (newConnectedUserIdList: number[]) => {
    setConnectedUserIdList(newConnectedUserIdList);
  };
  useEffect(() => {
    socket?.on("updateConnectedUsers", handleUpdateConnectedUserIdList);
    return () => {
      socket?.off("updateConnectedUsers", handleUpdateConnectedUserIdList);
    };
  }, [handleUpdateConnectedUserIdList]);
  /** END CONNECTED USER LIST */


  
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
          <ConnectedUsers connectedUserIdList={connectedUserIdList} />
          <br />

          <h4>Channel Id: {connectedChannel?.channelId}</h4>
          <h4>Channel Name: {connectedChannel?.channelName}</h4>
          <br />

          <LeaveChannelButton
            channelName={connectedChannel.channelName}
            sendDisconnect={sendDisconnect}
          />
          <br />
          
          <MessageInput send={send} />
          <Messages messages={messages} />
        </>
      }
    </>
  );
}

export default WebsSocketCdaiTest;
