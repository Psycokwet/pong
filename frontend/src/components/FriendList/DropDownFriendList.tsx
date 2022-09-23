import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { userStatusEnum } from "./FriendList";
import SubFriendList from "./SubFriendList";

type DropDownFriendListProps = {
  subListInfo: {
    status: userStatusEnum;
    color: string;
    group_name: string;
    invite?: React.MouseEventHandler<HTMLButtonElement>;
    button_name?: string;
  }[];
  profile_data: {
    login: string;
    nickname: string;
    status: userStatusEnum;
    image_url: string;
  }[];
};

const DropDownFriendList: React.FC<DropDownFriendListProps> = ({
  subListInfo,
  profile_data,
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      {/* Searching area */}
      <div className="flex items-center p-1 bg-white">
        <span>
          <FaSearch size={20} className="text-gray-500" />
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search a name"
          className="text-gray-700 placeholder:text-gray-500 p-2 outline-none rounded-xl"
        />
      </div>

      {/* Sub lists */}
      <div>
        {subListInfo?.map((aSubList) => {
          return (
            <SubFriendList
              key={aSubList.status}
              friend_list={profile_data}
              input={inputValue}
              group_status={aSubList.status}
              color={aSubList.color}
              group_name={aSubList.group_name}
              handle_click={aSubList.invite}
              group_button_name={aSubList.button_name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DropDownFriendList;
