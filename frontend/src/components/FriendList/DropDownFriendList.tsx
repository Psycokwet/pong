import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import UserListByStatus from "./UserListByStatus";
import { Socket } from "socket.io-client";
import { UserInterface } from "/shared/interfaces/UserInterface";
import { Status } from "/shared/interfaces/UserStatus";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { statusList } from "../Common/StatusList"

type DropDownFriendListProps = {
  userFriendList: UserInterface;
  socket: Socket|undefined;
};

const DropDownFriendList: React.FC<DropDownFriendListProps> = ({
  socket,
  userFriendList,
}) => {
  const [inputFilter, setInputFilter] = useState("");

  return (
    <div className="rounded-b-md overflow-none">
      {/* Searching area */}
      <div className="flex items-center p-1 bg-gray-600">
        <span>
          <FaSearch size={20} className="text-white-100" />
        </span>
        <input
          type="text"
          value={inputFilter}
          onChange={(e) => setInputFilter(e.target.value)}
          placeholder="Search a name"
          className="text-white-900 placeholder:text-gray-400 p-2 outline-none rounded-xl bg-gray-600"
        />
      </div>

      {/* Sub lists */}
      <div>
        {statusList?.map((aStatusList) => {
          return (
            <UserListByStatus
              key={aStatusList.status}
              userList={userFriendList}
              inputFilter={inputFilter}
              statusList={aStatusList}
              socket={socket}
              roomId={0}
              menuSettings={({
                challenge:aStatusList.status===Status.ONLINE,
                watch:aStatusList.status===Status.PLAYING,
                privileges:Privileges.MEMBER,
                friend:true,
              })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DropDownFriendList;
