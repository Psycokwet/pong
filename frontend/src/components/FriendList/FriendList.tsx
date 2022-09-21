import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import { BiChevronDown } from "react-icons/bi";

import Profile from "../Profile/Profile";
import DropDownFriendList from "./DropDownFriendList";

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
    nickname: "scarboniiii",
    status: userStatusEnum.Online,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "scarboni1",
    nickname: "scarboni1234",
    status: userStatusEnum.Playing,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "cdai",
    nickname: "cdai11",
    status: userStatusEnum.Offline,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "cdai1",
    nickname: "cdai1234",
    status: userStatusEnum.Online,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "nader",
    nickname: "nader322",
    status: userStatusEnum.Playing,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "nader1",
    nickname: "nader1432",
    status: userStatusEnum.Offline,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "moot",
    nickname: "moot234",
    status: userStatusEnum.Offline,
    image_url: "https://picsum.photos/400",
  },
  {
    login: "moot1",
    nickname: "moot1123",
    status: userStatusEnum.Online,
    image_url: "https://picsum.photos/400",
  },
];

/******************* Challenge / Watch Stream ************
 * To be changed later...
 *********************************************************/

const inviteToChallenge = () => {
  console.log("Wanna play?");
};

const watchStream = () => {
  console.log("Streaming...");
};

const sendMessage = () => {
  console.log("Send message: Hi there!!!");
};

/******************* Sub List ************************/
const subList = [
  {
    status: userStatusEnum.Online,
    color: "text-green-400",
    group_name: "Online",
    invite: inviteToChallenge,
    button_name: "Challenge",
  },
  {
    status: userStatusEnum.Playing,
    color: "text-yellow-400",
    group_name: "Playing",
    invite: watchStream,
    button_name: "Watch",
  },
  {
    status: userStatusEnum.Offline,
    color: "text-red-500",
    group_name: "Offline",
    // invite: sendMessage,
    // button_name: "Message",
  },
];

/***************** Component **********************************/

const FriendList = () => {
  const [active, setActive] = useState(false);
  

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

      {/************************* Dropdown Menu **************************/}
      <div
        className={
          active ? "bg-gray-700 mt-2 max-h-60 overflow-y-auto" : "hidden"
        }
      >
        <DropDownFriendList subListInfo={subList} profile_data={UserFriendList}/>
      </div>

      {/* ************************ Router ************************* */}
      <Routes>
        {UserFriendList.map((one_friend) => {
          return (
            <Route
              key={one_friend.login}
              path={`/profile/:user_login`}
              element={<Profile />}
            />
          );
        })}
      </Routes>
    </div>
  );
};

export default FriendList;
