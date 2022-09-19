import React from "react";
import { useState } from "react";

import { BiChevronDown } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

import SubFriendList from "./SubFriendList";

/***************** TYPE ***************************************/

export enum userStatusEnum {
  Online,
  Playing,
  Offline,
}

/**************************************************
 * I guess this is the kind of data we'll get from 
 * backend / database through api ?! To DELETE later.
 **************************************************/
const UserFriendList = [
  {
    login: "scarboni",
    nickname: "scarboni",
    status: userStatusEnum.Online,
    link_to_profile: "/scarboni",
  },
  {
    login: "scarboni1",
    nickname: "scarboni1",
    status: userStatusEnum.Playing,
    link_to_profile: "/scarboni1",
  },
  {
    login: "cdai",
    nickname: "cdai",
    status: userStatusEnum.Offline,
    link_to_profile: "/cdai",
  },
  {
    login: "cdai1",
    nickname: "cdai1",
    status: userStatusEnum.Online,
    link_to_profile: "/cdai1",
  },
  {
    login: "nader",
    nickname: "nader",
    status: userStatusEnum.Playing,
    link_to_profile: "/nader",
  },
  {
    login: "nader1",
    nickname: "nader1",
    status: userStatusEnum.Offline,
    link_to_profile: "/nader1",
  },
  {
    login: "moot",
    nickname: "moot",
    status: userStatusEnum.Offline,
    link_to_profile: "/moot",
  },
  {
    login: "moot1",
    nickname: "moot1",
    status: userStatusEnum.Online,
    link_to_profile: "/moot1",
  },
];

/******************* Sub List ************************/
const subList = [
  {
    status: userStatusEnum.Online,
    color: "text-green-400",
    group_name: "Online",
  },
  {
    status: userStatusEnum.Playing,
    color: "text-yellow-400",
    group_name: "Playing",
  },
  {
    status: userStatusEnum.Offline,
    color: "text-red-500",
    group_name: "Offline",
  },
];

/***************** Component **********************************/

const FriendList = () => {
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const showList = () => {
    setActive(!active);
  };

  return (
      <div className="absolute top-[120px] right-0 text-white bg-gray-900">
        <div
          className="p-2 flex items-center text-2xl font-bold"
          onClick={showList}
        >
          <span className="px-4">Friend List</span>
          <BiChevronDown size={20} className={`${active && "rotate-180"}`} />
        </div>
        <div
          className={
            active ? "bg-gray-700 mt-2 max-h-60 overflow-y-auto" : "hidden"
          }
        >
          <div className="flex items-center p-1 bg-white">
            <span>
              <FaSearch size={20} className="text-gray-500" />
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search a name"
              className="text-gray-700 placeholder:text-gray-500 p-2 outline-none rounded-xl w-40"
            />
          </div>
          <div>
            {subList?.map((aSubList) => {
              return (
                <SubFriendList
                  key={aSubList.status}
                  friend_list={UserFriendList}
                  input={inputValue}
                  user_status={aSubList.status}
                  color={aSubList.color}
                  group_name={aSubList.group_name}
                />
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default FriendList;
