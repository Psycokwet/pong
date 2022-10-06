import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import UserPicture from "../UserPicture/UserPicture";
import ChatList from "./ChatList/ChatList";
import TextField from "./TextField/TextField";
import Messages from "./Messages/Messages";
import ChannelUserListByStatus from "./UserInChannelList/ChannelUserListByStatus";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { Message } from "/shared/interfaces/Message";
import { statusList } from "../Common/StatusList"
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { Status } from "/shared/interfaces/UserStatus";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

function Chat ({socket}:{socket:Socket|undefined}) {
  const [messages, setMessages] = useState<Message[]>([])
  // const [lastMessage, setLastMessage] = useState<Message>(undefined)
  const [connectedChannel, setConnectedChannel] = useState<ChannelData>(undefined);
  const [attachedUserList, setAttachedUserList] = useState<ChannelUserInterface[]>([]);
  const [userPrivilege, setPrivilege] = useState<number>(Privileges.MEMBER);

  const addMessage = (newElem:Message) => {
    if (connectedChannel && newElem.roomId == connectedChannel.channelId)
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

  useEffect(() => {
    if (connectedChannel)
      socket?.emit(ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_REQUEST, connectedChannel.channelId)
  }, [connectedChannel]);
  useEffect(() => {
    socket?.on(
      ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION, 
      (userList: ChannelUserInterface[]) => setAttachedUserList(userList)
    );

    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION,
        (userList: ChannelUserInterface[]) => setAttachedUserList(userList)
      );
    };
  }, [setAttachedUserList]);

  /** UNATTACH FROM CHANNEL */
  useEffect(() => {
    socket?.on(
      ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_CONFIRMATION,
      (unattachedUserId: number) => setAttachedUserList(
        (current) => current.filter((user) => user.id !== unattachedUserId)
      )
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_CONFIRMATION,
        (unattachedUserId: number) => setAttachedUserList(
          (current) => current.filter((user) => user.id !== unattachedUserId)
        )
      );
    };
  }, []);
  /** END UNATTACH FROM CHANNEL */

  const handleDisconnectChannel = () => {
    setConnectedChannel(undefined);
    setMessages([]);
    setAttachedUserList([]);
    setPrivilege(Privileges.MEMBER)
  }
  const handleLeaveChannel = () => {
    socket?.emit(ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_REQUEST, {
      channelName: connectedChannel.channelName
    });
    handleDisconnectChannel();
  }

  const setupPrivilege = (val: { privilege: Privileges }) => {
    setPrivilege(val.privilege);
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupPrivilege);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupPrivilege);
  }}, []);

  return (
    <div className="bg-black text-white h-7/8 grid grid-cols-5 grid-rows-6 gap-4">
      <ChatList
        handleLeaveChannel={handleLeaveChannel}
        msg={messages[messages.length - 1]}
        socket={socket}
        connectedChannel={connectedChannel}
        userPrivilege={userPrivilege}
        handleDisconnectChannel={handleDisconnectChannel}
        // lastMessage={lastMessage}
      />
      <Messages messages={messages}/>
      {
        connectedChannel ?
        <TextField socket={socket} connectedChannel={connectedChannel} />
        :
        <></>
      }
      <div className="row-start-1 row-span-6 col-start-5 p-x-8">
        {connectedChannel != undefined ?
        statusList?.map((aStatusList) => {
          return (
            <ChannelUserListByStatus
              userPrivilege={userPrivilege}
              key={aStatusList.status}
              userList={attachedUserList}
              inputFilter={""}
              statusList={aStatusList}
              socket={socket}
              channelName={connectedChannel.channelName}
              menuSettings={({
                challenge:aStatusList.status === Status.ONLINE,
                watch:aStatusList.status === Status.PLAYING,
              })}
            />
          );
        })
        : <></>
        }
        <UserPicture />
      </div>
    </div>
  )
}

export default Chat