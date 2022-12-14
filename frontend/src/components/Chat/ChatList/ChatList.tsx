import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import Channel from "./Channel/Channel";
import DirectMessage from "./DirectMessage/DirectMessage";
import ChannelMenu from "./ChannelMenu/ChannelMenu";
import DirectMessageMenu from "./DirectMessageMenu/DirectMessageMenu";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import ChannelData from "/shared/interfaces/ChannelData";
import Message from "/shared/interfaces/Message";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { BlockedUserInterface } from "/shared/interfaces/BlockedUserInterface";

function ChatList({
  socket,
  connectedChannel,
  handleLeaveChannel,
  userPrivilege,
  handleDisconnectChannel,
  /* lastMessage,*/
  blockedUserList,
  channelList,
  setChannelList,
}: {
  socket: Socket | undefined;
  connectedChannel: ChannelData | undefined;
  handleLeaveChannel: any;
  userPrivilege: Privileges;
  handleDisconnectChannel: any;
  /*lastMessage: Message;*/
  blockedUserList: BlockedUserInterface[];
  channelList: ChannelData[];
  setChannelList: any;
}) {
  const [directMessageList, setDirectMessageList] = useState<ChannelData[]>([]);

  useEffect(() => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_ATTACHED_CHANNEL_LOBBY_REQUEST);
  }, []);
  useEffect(() => {
    socket?.emit(ROUTES_BASE.CHAT.JOIN_DM_CHANNEL_LOBBY_REQUEST);
  }, []);

  useEffect(() => {
    socket?.on(
      ROUTES_BASE.CHAT.LIST_ALL_ATTACHED_CHANNELS,
      (newChannelList: ChannelData[]) => setChannelList(newChannelList)
    );
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.LIST_ALL_ATTACHED_CHANNELS,
        (newChannelList: ChannelData[]) => setChannelList(newChannelList)
      );
    };
  }, []);

  const resetDirectMessageList = (directMessageList: ChannelData[]) => {
    setDirectMessageList(directMessageList);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS, resetDirectMessageList);
    return () => {
      socket?.off(
        ROUTES_BASE.CHAT.LIST_ALL_DM_CHANNELS,
        resetDirectMessageList
      );
    };
  }, [resetDirectMessageList]);

  const filteredConversations: ChannelData[] = directMessageList.filter(
    (directMessage) => {
      return (
        blockedUserList.find(
          (blockedUser) => blockedUser.pongUsername == directMessage.channelName
        ) == undefined
      );
    }
  );
  return (
    <div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end relative">
      <div>
        <ChannelMenu socket={socket} />
        {channelList.map((channel: ChannelData, i: number) => (
          <div key={i}>
            <Channel
              userPrivilege={userPrivilege}
              handleLeaveChannel={handleLeaveChannel}
              channel={channel}
              socket={socket}
              connectedChannel={connectedChannel}
              handleDisconnectChannel={handleDisconnectChannel}
            />
          </div>
        ))}
      </div>
      <div>
        <DirectMessageMenu socket={socket} />
        {filteredConversations.map((directMessage) => {
          return (
            <div key={directMessage.channelId}>
              <DirectMessage
                socket={socket}
                channel={directMessage}
                // message={lastMessage === undefined ? "" : lastMessage}
                connectedChannel={connectedChannel}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
