import React from "react";
import { BsCircleFill } from "react-icons/bs";
import ChannelUserInterface from "/shared/interfaces/ChannelUserInterface";
import { BlockedUserInterface } from "/shared/interfaces/BlockedUserInterface";
import { Socket } from "socket.io-client";
import ChannelUserMenu from "./ChannelUserMenu";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { MenuSettingsType } from "../../UserInList/MenuSettings";
import { UserStatus } from "../../Common/StatusList";

type ChannelUserListByStatusProps = {
  userList: ChannelUserInterface[];
  inputFilter: string;
  statusList: UserStatus;
  socket: Socket | undefined;
  channelName: string;
  menuSettings: MenuSettingsType;
  userPrivilege: Privileges;
  blockedUserList: BlockedUserInterface[];
};

const ChannelUserListByStatus: React.FC<ChannelUserListByStatusProps> = ({
  userList,
  inputFilter,
  statusList,
  socket,
  channelName,
  menuSettings,
  userPrivilege,
  blockedUserList,
}) => {
  return (
    <>
      {/* Group Name */}
      <div className="flex items-center font-bold">
        <span className="px-2">
          <BsCircleFill size="15" className={`${statusList.color}`} />
        </span>
        <p>{statusList.groupName}</p>
      </div>

      {userList
        ?.sort(
          (
            userA: ChannelUserInterface,
            userB: ChannelUserInterface
          ): number => {
            if (userA.id > userB.id) return 1;
            if (userA.id < userB.id) return -1;
            return 0;
          }
        )
        .filter(
          (user: ChannelUserInterface) => user.status === statusList.status
        )
        .map((user: ChannelUserInterface) => {
          return (
            <ChannelUserMenu
              channelName={channelName}
              userPrivilege={userPrivilege}
              key={user.id}
              pointedUser={user}
              inputFilter={inputFilter}
              socket={socket}
              menuSettings={menuSettings}
              blockedUserList={blockedUserList}
            />
          );
        })}
    </>
  );
};

export default ChannelUserListByStatus;
