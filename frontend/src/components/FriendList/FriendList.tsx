import React from "react";
import { useState } from "react";
import SubFriendList from "./SubFriendList";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";

/**************************************************
 * I guess this data we'll get from backend /
 * database through api ?! To be delete later.
 **************************************************/
const UserFriendList = [
  {
    login: "scarboni",
    nickname: "scarboni",
    status: "online",
    link_to_profile: "/scarboni",
  },
  {
    login: "scarboni1",
    nickname: "scarboni1",
    status: "online",
    link_to_profile: "/scarboni1",
  },
  {
    login: "cdai",
    nickname: "cdai",
    status: "offline",
    link_to_profile: "/cdai",
  },
  {
    login: "cdai1",
    nickname: "cdai1",
    status: "offline",
    link_to_profile: "/cdai1",
  },
  {
    login: "nader",
    nickname: "nader",
    status: "playing",
    link_to_profile: "/nader",
  },
  {
    login: "nader1",
    nickname: "nader1",
    status: "playing",
    link_to_profile: "/nader1",
  },
  {
    login: "moot",
    nickname: "moot",
    status: "offline",
    link_to_profile: "/moot",
  },
  {
    login: "moot1",
    nickname: "moot1",
    status: "offline",
    link_to_profile: "/moot1",
  },
];

/***************** TYPE ***************************************/

enum userStatusEnum {
  Online,
  Playing,
  Offline,
}

/***************** Component **********************************/

const FriendList = () => {
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const showList = () => {
    setActive(!active);
  };

  const goToUserPage = () => {
    window.location.replace("http://localhost:8080/profile")
  };

  return (
    <div className="text-white bg-gray-900 w-60">
      <div
        className="w-full p-2 flex items-center justify-between text-2xl font-bold"
        onClick={showList}
      >
        Friend List
        <BiChevronDown size={20} className={`${active && "rotate-180"}`} />
      </div>
      <div
        className={
          active ? "bg-gray-700 mt-2 max-h-40 overflow-y-auto" : "hidden"
        }
      >
        <div className="flex items-center px-2 sticky top-0 bg-white">
          <AiOutlineSearch size={18} className="text-gray-700" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search a name"
            className="text-gray-700 placeholder:text-gray-700 p-2 outline-none"
          />
        </div>
        {UserFriendList?.map((friend) => (
          <li
            key={friend.nickname}
            className={`p-2 hover:bg-sky-600 hover:text-white
            ${
              friend.nickname.toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
            onClick={goToUserPage}
          >
            {friend.nickname}
            <span>{friend.status}</span>
          </li>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
