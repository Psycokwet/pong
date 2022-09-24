import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import ChannelAttachedUsers from "./ChannelAttachedUsers";
import ConnectedUsers from "./ConnectedUsers";
import CreateChannel from "./CreateChannel";
import JoinChannelButtons from "./JoinChannelButtons";
import LeaveChannelButton from "./LeaveChannelButton";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
const ENDPOINT = "http://localhost:8080";
import { ROUTES_BASE } from "../../../shared/websocketRoutes/routes";
import ChannelData from "../../../shared/interfaces/ChannelData";
import Message from "../../../shared/interfaces/Message";
import User from "../../../shared/interfaces/User";

function WebSocketCdaiTest() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedChannel, setConnectedChannel] = useState<
    ChannelData | undefined
  >(undefined);
  const [connectedUserIdList, setConnectedUserIdList] = useState<number[]>([]);
  const [allChannel, setAllChannel] = useState<ChannelData[]>([]);
  const [channelAttachedUserList, setChannelAttachedUserList] = useState<User[]>([]);

  /** CHANNEL ATTACHED USER LIST */
  const handleChannelAttachedUserList = (channelAttachedUserList: User[]) => {
    setChannelAttachedUserList(channelAttachedUserList);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.UPDATE_CHANNEL_ATTACHED_USER_LIST, handleChannelAttachedUserList);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.UPDATE_CHANNEL_ATTACHED_USER_LIST, handleChannelAttachedUserList);
    };
  }, [handleChannelAttachedUserList]);
  /** END CHANNEL ATTACHED USER LIST */

  /** MESSAGE */
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

  const messageListener = (message: Message) => {
    setMessages((current: Message[]) => [...current, message]);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, messageListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, messageListener);
    };
  }, [messageListener]);

  const handleMessageHistory = (messageHistory: Message[]) => {
    setMessages(messageHistory);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.MESSAGE_HISTORY, handleMessageHistory);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.MESSAGE_HISTORY, handleMessageHistory);
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
    socket?.on(
      ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION,
      channelCreationListener
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION,
        channelCreationListener
      );
    };
  }, [channelCreationListener]);
  /** END CREATE CHANNEL */

  /** JOIN CHANNEL */
  const handleJoinChannelClick = (channelId: number) => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNE_REQUEST, channelId);
  };
  const handleJoinChannel = (message: ChannelData) => {
    setConnectedChannel(message);
  };
  useEffect(() => {
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
  // handle new channel creation
  const handleNewChannelCreation = (newChannel: any) => {
    setAllChannel((current) => [...current, newChannel]);
  };
  useEffect(() => {
    socket?.on("newChannelCreated", handleNewChannelCreation);
    return () => {
      socket?.off("newChannelCreated", handleNewChannelCreation);
    };
  }, [handleNewChannelCreation]);
  /** END GET ALL CHANNEL */

  /** DISCONNECT CHANNEL */
  const sendDisconnect = () => {
    socket?.emit(
      ROUTES_BASE.CHAT.DISCONNECT_FROM_CHANNEL_REQUEST,
      connectedChannel?.channelId
    );
  };
  const handleDisconnect = () => {
    setConnectedChannel(undefined);
    setMessages([]);
    setChannelAttachedUserList([]);
  };
  useEffect(() => {
    socket?.on(
      ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION,
      handleDisconnect
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION,
        handleDisconnect
      );
    };
  }, [handleDisconnect]);
  /** DISCONNECT CHANNEL */

  /** CONNECTED USER LIST */
  const handleUpdateConnectedUserIdList = (
    newConnectedUserIdList: number[]
  ) => {
    setConnectedUserIdList(newConnectedUserIdList);
  };
  useEffect(() => {
    socket?.on(
      ROUTES_BASE.CHAT.UPDATE_CONNECTED_USERS,
      handleUpdateConnectedUserIdList
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.UPDATE_CONNECTED_USERS,
        handleUpdateConnectedUserIdList
      );
    };
  }, [handleUpdateConnectedUserIdList]);
  /** END CONNECTED USER LIST */

  return (
    <>
      {!connectedChannel ? (
        <>
          <CreateChannel handleCreateChannel={handleCreateChannel} />
          <JoinChannelButtons
            allChannel={allChannel}
            handleClick={handleJoinChannelClick}
          />
        </>
      ) : (
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
          <ChannelAttachedUsers channelAttachedUserList={channelAttachedUserList} />
          <br />

          <MessageInput send={send} />
          <Messages messages={messages} />
        </>
      )}
    </>
  );
}

export default WebSocketCdaiTest;
