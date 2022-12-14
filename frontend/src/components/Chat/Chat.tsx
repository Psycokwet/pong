import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import ChatList from "./ChatList/ChatList";
import TextField from "./TextField/TextField";
import Messages from "./Messages/Messages";
import ChannelUserListByStatus from "./UserInChannelList/ChannelUserListByStatus";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import ChannelData from "/shared/interfaces/ChannelData";
import Message from "/shared/interfaces/Message";
import ChannelUserInterface from "/shared/interfaces/ChannelUserInterface";
import { statusList } from "../Common/StatusList";
import { BlockedUserInterface } from "/shared/interfaces/BlockedUserInterface";
import { Status } from "/shared/interfaces/UserStatus";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { UserInterface } from "/shared/interfaces/UserInterface";
import { Api } from "../../api/api";

type UserAvatar = {
  avatarUrl: string | undefined;
  pongUsername: string;
};

const api = new Api();
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
  const [userPrivilege, setUserPrivilege] = useState<number>(Privileges.MEMBER);
  const [avatarList, setAvatarList] = useState<UserAvatar[]>([]);
  const [channelList, setChannelList] = useState<ChannelData[]>([]);

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

  useEffect(() => {
    attachedUserList.map(async (user: ChannelUserInterface) => {
      await api.getPicture(user.pongUsername).then((res) => {
        if (res.status == 200)
          res.blob().then((myBlob) => {
            setAvatarList((current) => [
              ...current,
              {
                avatarUrl: URL.createObjectURL(myBlob),
                pongUsername: user.pongUsername,
              },
            ]);
          });
        else return "";
      });
    });
  }, [attachedUserList]);

  /**  Set actual connectedChannel */
  const channelListener = (channel: ChannelData | undefined) => {
    console.log(channel)
    setConnectedChannel((current: ChannelData | undefined) => { console.log(current, channel); return channel });
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
  // const disconnect = () => {
  //   setMessages([]);
  //   // setConnectedChannel(undefined);
  // };
  // useEffect(() => {
  //   socket?.on(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, disconnect);
  //   return () => {
  //     socket?.off(ROUTES_BASE.CHAT.CONFIRM_CHANNEL_DISCONNECTION, disconnect);
  //   };
  // }, [disconnect]);

  /**  Listen User list for channel */
  const resetAttachedUserList = (newList: ChannelUserInterface[]) => {
    setAttachedUserList([...newList]);
  };
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
      resetAttachedUserList
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.ATTACHED_USERS_LIST_CONFIRMATION,
        resetAttachedUserList
      );
    };
  }, []);
  const updateUserStatus = (user: UserInterface) => {
    setAttachedUserList((current) => {
      const found: ChannelUserInterface | undefined = current.find(
        (attachedUser) => attachedUser.id == user.id
      );
      if (found === undefined) return current;
      const filteredList = current.filter(
        (attachedUser) => attachedUser.id != user.id
      );
      found.status = user.status;
      return [...filteredList, found];
    });
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.USER.CONNECTION_CHANGE, updateUserStatus);
    return () => {
      socket?.off(ROUTES_BASE.USER.CONNECTION_CHANGE, updateUserStatus);
    };
  }, [updateUserStatus]);

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
    if (connectedChannel) {
      setMessages([]);
      setAttachedUserList([]);
      setUserPrivilege(Privileges.MEMBER);
      setChannelList((current: ChannelData[]) =>
        current.filter((channel) => 
          connectedChannel && channel.channelId !== connectedChannel.channelId
        )
      );
      setConnectedChannel(undefined);
    }
  };

  const handleLeaveChannel = () => {
    if (!connectedChannel) return;
    socket?.emit(ROUTES_BASE.CHAT.UNATTACH_TO_CHANNEL_REQUEST, {
      channelName: connectedChannel.channelName,
    });
    handleDisconnectChannel();
  };

  const youArePromoted = (privilege: Privileges) => {
    setUserPrivilege(privilege);
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

  const setupPrivilege = (inComingPrivilege: Privileges) => {
    console.log(inComingPrivilege, userPrivilege);
    setUserPrivilege((current: Privileges) => inComingPrivilege);
  };
  // useEffect(() => {
  //   if (connectedChannel)
  //     socket?.emit(
  //       ROUTES_BASE.CHAT.USER_PRIVILEGES_REQUEST,
  //       connectedChannel.channelId
  //     );
  // }, [connectedChannel]);
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION, setupPrivilege);
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.USER_PRIVILEGES_CONFIRMATION,
        setupPrivilege
      );
    };
  }, []);

  const handleBannedFromChannel = (channelBannedFrom: ChannelData) => {
    console.log(channelBannedFrom, connectedChannel)
    if (connectedChannel && connectedChannel.channelId === channelBannedFrom.channelId) {
      setMessages([]);
      setAttachedUserList([]);
      setUserPrivilege(Privileges.MEMBER);
      setConnectedChannel(undefined);
    }
    setChannelList((current: ChannelData[]) =>
      current.filter(
        (channel) => channel.channelId !== channelBannedFrom.channelId
      )
    );
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.GET_BANNED, handleBannedFromChannel);
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.GET_BANNED,
        handleBannedFromChannel,
      );
    };
  }, [connectedChannel]);

  return (
    <div className="bg-black text-white h-7/8 grid grid-cols-5 grid-rows-6 gap-4">
      <ChatList
        handleLeaveChannel={handleLeaveChannel}
        socket={socket}
        connectedChannel={connectedChannel}
        userPrivilege={userPrivilege}
        handleDisconnectChannel={handleDisconnectChannel}
        blockedUserList={blockedUserList}
        channelList={channelList}
        setChannelList={setChannelList}
        // lastMessage={lastMessage}
      />
      <Messages
        messages={messages}
        blockedUserList={blockedUserList}
        avatarList={avatarList}
      />
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
      </div>
    </div>
  );
}

export default Chat;
