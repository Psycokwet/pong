import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { UserInterface } from "/shared/interfaces/UserInterface";
import UserInList from "../UserInList/UserInList"
import { MenuSettingsType } from "../UserInList/MenuSettings"
import { UserStatus } from "../Common/Sublist"
import { Socket } from "socket.io-client";

type UserListByStatusProps = {
  userList: UserInterface[];
  inputFilter: string;
  subList: UserStatus;
  socket: Socket | undefined,
  roomId: number
  menuSettings: MenuSettingsType
};

const UserListByStatus: React.FC<UserListByStatusProps> = ({
  userList,
  inputFilter,
  subList,
  socket,
  roomId,
  menuSettings,
}) => {
  return (
    <>
      {/* Group Name */}
      <div className="flex items-center font-bold">
        <span className="px-2">
          <BsCircleFill size="15" className={`${subList.color}`} />
        </span>
        <p>{subList.groupName}</p>
      </div>

      {userList?.filter((value) => value.status === subList.status).map((user) => {
        return (
          <UserInList
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

export default UserListByStatus;
