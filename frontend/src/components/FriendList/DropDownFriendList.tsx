import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import SubFriendList from "./SubFriendList";
import { Socket } from "socket.io-client";
import { UserInterface, Status } from "/shared/interfaces/UserInterface";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";
import { subList } from "../Common/Sublist"

type DropDownFriendListProps = {
  userFriendList: UserInterface;
  socket: Socket|undefined;
};

const DropDownFriendList: React.FC<DropDownFriendListProps> = ({
  socket,
  userFriendList,
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="rounded-b-md overflow-none">
      {/* Searching area */}
      <div className="flex items-center p-1 bg-gray-600">
        <span>
          <FaSearch size={20} className="text-white-100" />
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search a name"
          className="text-white-900 placeholder:text-gray-400 p-2 outline-none rounded-xl bg-gray-600"
        />
      </div>

      {/* Sub lists */}
      <div>
        {subList?.map((aSubList) => {
          return (
            <SubFriendList
              key={aSubList.status}
              userFriendList={userFriendList}
              input={inputValue}
              subList={aSubList}
              socket={socket}
              roomId={0}
              menu={({
                challenge:aSubList.status===Status.ONLINE,
                watch:aSubList.status===Status.PLAYING,
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
