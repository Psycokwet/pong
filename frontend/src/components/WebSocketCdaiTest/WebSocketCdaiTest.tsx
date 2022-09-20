import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
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
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);

  /** MESSAGE */
  const send = (message: string) => {
    socket?.emit("send_message", {channelId: connectedChannel?.channelId, message});
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
    socket?.on("receive_message", messageListener);
    return () => {
      socket?.off("receive_message", messageListener);
    };
  }, [messageListener]);
  /** END MESSAGE */

  /** CREATE CHANNEL */
  const handleCreateRoom = (newChannelName: string) => {
    socket?.emit("createChannel", newChannelName);
  };
  const roomCreationListener = (roomIdFromBack: ChannelData) => {
    console.log(roomIdFromBack);
    setConnectedChannel(roomIdFromBack);
  };
  useEffect(() => {
    socket?.on("confirmChannelCreation", roomCreationListener);
    return () => {
      socket?.off("confirmChannelCreation", roomCreationListener);
    };
  }, [roomCreationListener]);
  /** END CREATE CHANNEL */



  /** JOIN CHANNEL */
  useEffect(() => {
    socket?.emit("joinChannelLobby");
  }, [socket]);

  const handleClick = (channelId: number) => {
    socket?.emit("joinChannelRequest", channelId);
  }
  const handleJoinRoom = (message: ChannelData) => {
    console.log(message)
    setConnectedChannel(message)
  }
  useEffect(()=> {
    socket?.on("confirmChannelEntry", handleJoinRoom);
    return () => {
      socket?.off("confirmChannelEntry", handleJoinRoom);
    };
  }, [handleJoinRoom]);
  /** END JOIN CHANNEL */
  


  /** GET ALL CHANNEL */
  const getAllChannel = (message: []) => {
    console.log(message)
    setAllChannel(message);
  };
  useEffect(() => {
    socket?.on("allChannel", getAllChannel);
    return () => {
      socket?.off("allChannel", getAllChannel);
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
    socket?.on("disconnectedFromChannel", handleDisconnect);
    return () => {
      socket?.off("disconnectedFromChannel", handleDisconnect);
    };
  }, [handleDisconnect]);
  /** DISCONNECT CHANNEL */





  
  return (
    <>
      {
        !connectedChannel ?
        <>
          <CreateChannel
            handleCreateRoom={handleCreateRoom}
          />
          <JoinChannelButtons
            socket={socket}
            allChannel={allChannel}
            setConnectedChannel={setConnectedChannel}
          />
        </>
        :
        <>
          <h4>RoomId: {connectedChannel?.channelId}</h4>
          <h4>Room Name: {connectedChannel?.channelName}</h4>
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
