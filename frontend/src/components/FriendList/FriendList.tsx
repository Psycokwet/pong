import React from "react";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { RiRadioButtonLine } from "react-icons/ri"
import DropDownFriendList from "./DropDownFriendList";

/***************** TYPE ***************************************/

enum userStatusEnum {
  Online,
  Playing,
  Offline,
}

/**************************************************
 * I guess this data we'll get from backend /
 * database through api ?! To be delete later.
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
    status: userStatusEnum.Online,
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
    status: userStatusEnum.Offline,
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
    status: userStatusEnum.Playing,
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
    status: userStatusEnum.Offline,
    link_to_profile: "/moot1",
  },
];

/***************** Component **********************************/

const FriendList = () => {
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const showList = () => {
    setActive(!active);
  };

  const goToUserPage = () => {
    window.location.replace("http://localhost:8080/profile");
  };

  return (
    <div className="text-white bg-gray-900">
      <div
        className="p-2 flex justify-between items-center text-2xl font-bold"
        onClick={showList}
      >
        Friend List
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
            className="text-gray-700 placeholder:text-gray-500 p-2 outline-none"
          />
        </div>
        {UserFriendList?.map((friend) => (
          <li
            key={friend.nickname}
            className={`flex justify-between p-2 hover:bg-sky-600 hover:text-white
            ${
              friend.nickname.startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={goToUserPage}
          >
            <span>{friend.nickname}</span>
            <span className={`${friend.status === userStatusEnum.Offline ? "text-red-600" : "text-green-600"}`}
            ><RiRadioButtonLine size="15"/></span>
          </li>
        ))}
      {/* <DropDownFriendList /> */}
      </div>
    </div>
  );
};

export default FriendList;
