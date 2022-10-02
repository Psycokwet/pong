import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import UserPicture from "../UserPicture/UserPicture";
import ChatList from "./ChatList/ChatList";
import TextField from "./TextField/TextField";
import Messages from "./Messages/Messages";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { Message } from "/shared/interfaces/Message";
import { statusList } from "../Common/StatusList"
import UserListByStatus from "../FriendList/UserListByStatus";
import { UserInterface, Status } from "/shared/interfaces/UserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

function Chat ({socket}:{socket:Socket|undefined}) {
  const [messages, setMessages] = useState<Message[]>([])
  // const [lastMessage, setLastMessage] = useState<Message>(undefined)
  const [connectedChannel, setConnectedChannel] = useState<ChannelData>(undefined);
  const [userAttachedList, setUserAttachedList] = useState<UserInterface[]>([]);

  const addMessage = (newElem:Message) => {
    if (connectedChannel && newElem.roomId === connectedChannel.channelId)
      setMessages((current) => [...current, newElem]);
    // setLastMessage(newElem);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, addMessage);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, addMessage);
    };
  }, [addMessage]);
  const resetMessages = (msgs:Message[]) => {
    setMessages(msgs);
    // setLastMessage(msgs.at(-1));
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.MESSAGE_HISTORY, resetMessages);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.MESSAGE_HISTORY, resetMessages);
    };
  }, [resetMessages]);


  const channelListener = (channel: ChannelData) => {
    setConnectedChannel(channel);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, channelListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, channelListener);
    };
  }, [channelListener]);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, channelListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, channelListener);
    };
  }, [channelListener]);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_DM_CHANNEL_CREATION, channelListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_DM_CHANNEL_CREATION, channelListener);
    };
  }, [channelListener]);


  const disconnect = () => {
    setMessages([]);
    setConnectedChannel(undefined);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, disconnect);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, disconnect);
    };
  }, [disconnect]);


  const ResetUserList = (list:UserInterface[]) => {
    setUserAttachedList(list);
  }
  useEffect(() => {
    if (connectedChannel)
      socket?.emit(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_REQUEST, connectedChannel.roomId)
  }, [connectedChannel]);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION, ResetUserList);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION, ResetUserList);
    };
  }, [ResetUserList]);
  return (
    <div className="bg-black text-white h-7/8 grid grid-cols-5 grid-rows-6 gap-4">
      <ChatList
        // lastMessage={lastMessage}
        socket={socket}
        connectedChannel={connectedChannel}
      />
      <Messages messages={messages}/>
      <TextField
        socket={socket}
        chan={connectedChannel}
      />
      <div className="row-start-1 row-span-6 col-start-5 p-x-8">
        {statusList?.map((aStatusList) => {
          return (
            <UserListByStatus
              key={aStatusList.status}
              userList={userAttachedList}
              inputFilter={""}
              statusList={aStatusList}
              socket={socket}
              roomId={connectedChannel?.roomId}
              menuSettings={({
                challenge:aStatusList.status===Status.ONLINE,
                watch:aStatusList.status===Status.PLAYING,
                privileges:Privileges.MEMBER,
                friend:false,
              })}
            />
          );
        })}
        <UserPicture />
      </div>
    </div>
  )
}

export default Chat