import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { ChannelUserInterface } from "/shared/interfaces/ChannelUserInterface";
import { MenuSettingsType } from "../UserInList/MenuSettings"
import { UserStatus } from "../Common/StatusList"
import { Socket } from "socket.io-client";
import ChannelUserMenu from "./UserInChannelList";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

type ChannelUserListByStatusProps = {
  userList: ChannelUserInterface[];
  inputFilter: string;
  statusList: UserStatus;
  socket: Socket | undefined;
  roomId: number;
  menuSettings: MenuSettingsType;
  userPrivilege: Privileges;
};

const ChannelUserListByStatus: React.FC<ChannelUserListByStatusProps> = ({
  userList,
  inputFilter,
  statusList,
  socket,
  roomId,
  menuSettings,
  userPrivilege,
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

      {userList?.filter((value) => value.status === statusList.status).map((user) => {
        return (
          <ChannelUserMenu
            userPrivilege={userPrivilege}
            key={user.id}
            user={user}
            inputFilter={inputFilter}
            socket={socket}
            menuSettings={menuSettings}
          />
        );
      })}
    </>
  );
};

export default ChannelUserListByStatus;
