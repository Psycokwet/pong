import React from "react";
import { useState } from "react";
import SubFriendList from "./SubFriendList";

/**************************************************
 * This data we'll get from backend/database
 **************************************************/
const UserFriendList = [
  {
    nickname: "scarboni",
    status: "online",
  },
  {
    nickname: "cdai",
    status: "offline",
  },
  {
    nickname: "nader",
    status: "playing",
  },
  {
    nickname: "moot",
    status: "offline",
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
    <div className="text-white flex flex-col bg-gray-900 border-4 w-1/6">
      <div className="text-2xl font-bold p-4" onClick={showList}>
        Friend List
      </div>
      <div className={active ? "bg-gray-600" : "hidden"}>
        {/* Todo 1: put a map here through user's friend list
        todo 2: put Friend List to the right and close to NavBar */}
        <SubFriendList type={statusList[0]} />
        <SubFriendList type={statusList[1]} />
        <SubFriendList type={statusList[2]} />
      </div>
    </div>
  );
};

export default FriendList;
