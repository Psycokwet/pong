import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { UserInterface } from "shared/interfaces/UserInterface";
import UserInList from "../UserInList/UserInList";
import { MenuSettingsType } from "../UserInList/MenuSettings";
import { UserStatus } from "../Common/StatusList";
import { Socket } from "socket.io-client";

type UserListByStatusProps = {
  userList: UserInterface[];
  inputFilter: string;
  statusList: UserStatus;
  socket: Socket | undefined;
  menuSettings: MenuSettingsType;
};

const UserListByStatus: React.FC<UserListByStatusProps> = ({
  userList,
  inputFilter,
  statusList,
  socket,
  menuSettings,
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
        ?.filter((value) => value.status === statusList.status)
        .map((user) => {
          return (
            <UserInList
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

export default UserListByStatus;
