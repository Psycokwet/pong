import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import UserPicture from "../UserPicture/UserPicture";
import ChatList from "./ChatList/ChatList";
import TextField from "./TextField/TextField";
import Messages from "./Messages/Messages";
import ChannelUserListByStatus from "./UserInChannelList/ChannelUserListByStatus";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import ChannelData from "/shared/interfaces/ChannelData";
import Message from "/shared/interfaces/Message";
import { statusList } from "../Common/StatusList";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { BlockedUserInterface } from "/shared/interfaces/BlockedUserInterface";
import { Status } from "/shared/interfaces/UserStatus";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

function Chat({ socket }: { socket: Socket | undefined }) {
  const [messages, setMessages] = useState<Message[]>([]);
  // const [lastMessage, setLastMessage] = useState<Message>(undefined)
  const [blockedUserList, setBlockedUserList] = useState<
    BlockedUserInterface[]
  >([]);
  const [connectedChannel, setConnectedChannel] = useState<
    ChannelData | undefined
  >(undefined);
  const [attachedUserList, setAttachedUserList] = useState<
    ChannelUserInterface[]
  >([]);
  const [userPrivilege, setPrivilege] = useState<number>(Privileges.MEMBER);

  const addMessage = (newElem: Message) => {
    if (connectedChannel && newElem.roomId == connectedChannel.channelId)
      setMessages((current) => [newElem, ...current]);
    // setLastMessage(newElem);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, addMessage);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.RECEIVE_MESSAGE, addMessage);
    };
  }, [addMessage]);
  const resetMessages = (msgs: Message[]) => {
    setMessages(msgs.reverse());
    // setLastMessage(msgs.at(-1));
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.MESSAGE_HISTORY, resetMessages);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.MESSAGE_HISTORY, resetMessages);
    };
  }, [resetMessages]);

  /**  Set actual connectedChannel */
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
      socket?.off(
        ROUTES_BASE.CHAT.CONFIRM_DM_CHANNEL_CREATION,
        channelListener
      );
    };
  }, [channelListener]);

  /**  Disconnect and clear page */
  const disconnect = () => {
    setMessages([]);
    setConnectedChannel(undefined);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, disconnect);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, disconnect);
    };
  }, [disconnect]);

  /**  Listen User list for channel */
  useEffect(() => {
    if (connectedChannel)
      socket?.emit(
        ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_REQUEST,
        connectedChannel.channelId
      );
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
      (unattachedUserId: number) =>
        setAttachedUserList((current) =>
          current.filter((user) => user.id !== unattachedUserId)
        )
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_CONFIRMATION,
        (unattachedUserId: number) =>
          setAttachedUserList((current) =>
            current.filter((user) => user.id !== unattachedUserId)
          )
      );
    };
  }, []);
  /** END UNATTACH FROM CHANNEL */

  /** Block user list update */
  const resetBlockUserList = (list: BlockedUserInterface[]) => {
    setBlockedUserList(list);
  };
  useEffect(() => {
    socket?.emit(ROUTES_BASE.USER.BLOCKED_USERS_LIST_REQUEST);
  }, []);
  useEffect(() => {
    socket?.on(
      ROUTES_BASE.USER.BLOCKED_USERS_LIST_CONFIRMATION,
      resetBlockUserList
    );
    return () => {
      socket?.off(
        ROUTES_BASE.USER.BLOCKED_USERS_LIST_CONFIRMATION,
        resetBlockUserList
      );
    };
  }, [resetBlockUserList]);
  const confirmUserBlocked = (user: string) => {
    //Need a toast here
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.USER.BLOCK_USER_CONFIRMATION, confirmUserBlocked);
    return () => {
      socket?.off(ROUTES_BASE.USER.BLOCK_USER_CONFIRMATION, confirmUserBlocked);
    };
  }, [confirmUserBlocked]);

  /** Other functions (handlers) */
  const handleDisconnectChannel = () => {
    setConnectedChannel(undefined);
    setMessages([]);
    setAttachedUserList([]);
    setPrivilege(Privileges.MEMBER);
  };
  const handleLeaveChannel = () => {
    if (!connectedChannel) return;
    socket?.emit(ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_REQUEST, {
      channelName: connectedChannel.channelName,
    });
    handleDisconnectChannel();
  };

  const youArePromoted = (privilege: Privileges) => {
    setPrivilege(privilege);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.SET_ADMIN_CONFIRMATION, youArePromoted);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.SET_ADMIN_CONFIRMATION, youArePromoted);
    };
  }, []);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.UNSET_ADMIN_CONFIRMATION, youArePromoted);
    return () => {
      socket?.off(ROUTES_BASE.CHAT.UNSET_ADMIN_CONFIRMATION, youArePromoted);
    };
  }, []);

  const setupPrivilege = (privilege: Privileges) => {
    setPrivilege(privilege);
  };
  useEffect(() => {
    if (connectedChannel)
      socket?.emit(
        ROUTES_BASE.CHAT.USER_PRIVILEGES_REQUEST,
        connectedChannel.channelId
      );
  }, [connectedChannel]);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupPrivilege);
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION,
        setupPrivilege
      );
    };
  }, []);

  return (
    <div className="bg-black text-white h-7/8 grid grid-cols-5 grid-rows-6 gap-4">
      <ChatList
        handleLeaveChannel={handleLeaveChannel}
        socket={socket}
        connectedChannel={connectedChannel}
        userPrivilege={userPrivilege}
        handleDisconnectChannel={handleDisconnectChannel}
        blockedUserList={blockedUserList}
        // lastMessage={lastMessage}
      />
      <Messages messages={messages} blockedUserList={blockedUserList} />
      {connectedChannel ? (
        <TextField socket={socket} connectedChannel={connectedChannel} />
      ) : (
        <></>
      )}
      <div className="row-start-1 row-span-6 col-start-5 p-x-8">
        {connectedChannel != undefined ? (
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
                menuSettings={{
                  challenge: aStatusList.status === Status.ONLINE,
                  watch: aStatusList.status === Status.PLAYING,
                }}
                blockedUserList={blockedUserList}
              />
            );
          })
        ) : (
          <></>
        )}
        <UserPicture />
      </div>
    </div>
  );
}

export default Chat;
