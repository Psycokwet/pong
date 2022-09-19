import React from "react";
import { useState } from "react";
import SubFriendList from "./SubFriendList";
import { BiChevronDown } from "react-icons/bi";

/**************************************************
 * This data we'll get from backend/database
 **************************************************/
const UserFriendList = [
  {
    nickname: "scarboni",
    status: "online",
    link_to_profile: "/scarboni",
  },
  {
    nickname: "cdai",
    status: "offline",
    link_to_profile: "/cdai",
  },
  {
    nickname: "nader",
    status: "playing",
    link_to_profile: "/nader",
  },
  {
    nickname: "moot",
    status: "offline",
    link_to_profile: "/moot",
  },
];

/*********************************************************/

const statusList = ["Online", "Offline", "Playing"];

const FriendList = () => {
  const [active, setActive] = useState(false);

  const showList = () => {
    setActive(!active);
  };

  return (
    <div className="text-white bg-gray-900 border-4 w-60">
      <div
        className="w-full p-2 flex items-center justify-between text-2xl font-bold"
        onClick={showList}
      >
        Friend List
        <BiChevronDown size={20} />
      </div>
      <div
        className={
          active ? "bg-gray-700 mt-2 max-h-40 overflow-y-auto" : "hidden"
        }
      >
        {/* Todo 1: put a map here through user's friend list
        todo 2: put Friend List to the right and close to NavBar */}
        <div>
          <input
            type="text"
            placeholder="Enter a friend's name"
            className="text-gray-700 placeholder:text-gray-700 p-2 outline-none"
          />
        </div>
        <SubFriendList listType={statusList[0]} />
        <SubFriendList listType={statusList[1]} />
        <SubFriendList listType={statusList[2]} />
      </div>
    </div>
  );
};

export default FriendList;
