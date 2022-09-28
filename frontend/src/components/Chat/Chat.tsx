import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import UserPicture from "../User Picture/UserPicture";
import ChatList from "./ChatList/ChatList";
import TextField from "./TextField/TextField";
import Messages from "./Messages/Messages";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { Message } from "/shared/interfaces/Message";
import { subList } from "../Common/Sublist"
import SubFriendList from "../FriendList/SubFriendList";
import { UserInterface, Status } from "/shared/interfaces/UserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

function Chat ({socket}:{socket:Socket|undefined}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [connectedChannel, setConnectedChannel] = useState<ChannelData>(undefined);
  const addMessage = (newElem:Message) => {
    setMessages([...messages, newElem]);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, addMessage);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, addMessage);
    };
  }, []);
  const resetMessages = (msgs:Message[]) => {
    setMessages(msgs);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.MESSAGE_HISTORY, resetMessages);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.MESSAGE_HISTORY, resetMessages);
    };
  }, []);


  const channelListener = (channel: ChannelData) => {
    setConnectedChannel(channel);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, channelListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_CREATION, channelListener);
    };
  }, []);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, channelListener);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_ENTRY, channelListener);
    };
  }, []);

  const [userAttachedList, setUserAttachedList] = useState<UserInterface[]>([]);
  const ResetUserList = (list:UserInterface[]) => {
    setUserAttachedList(list);
  }
  useEffect(() => {
    socket?.emit(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_REQUEST)
  }, []);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION, ResetUserList);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION, ResetUserList);
    };
  }, []);

  return (
    <div className="bg-black text-white h-7/8 grid grid-cols-5 grid-rows-6 gap-4">
      <ChatList msg={messages[messages.length - 1]} socket={socket} connectedChannel={connectedChannel}/>
      <Messages messages={messages}/>
      <TextField socket={socket} chan={connectedChannel} />
      <div className="row-start-1 row-span-6 col-start-5 p-x-8">
        {subList?.map((aSubList) => {
          return (
            <SubFriendList
              key={aSubList.status}
              userFriendList={userAttachedList}
              input={""}
              subList={aSubList}
              socket={socket}
              roomId={connectedChannel?.roomId}
              menu={({
                challenge:aSubList.status===Status.ONLINE,
                watch:aSubList.status===Status.PLAYING,
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