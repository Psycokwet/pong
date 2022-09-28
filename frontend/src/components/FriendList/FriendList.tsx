import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { User } from "/shared/interfaces/User";
import { Api } from '../../api/api';

import { BiChevronDown } from "react-icons/bi";

import DropDownFriendList from "./DropDownFriendList";

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

/***************** Component **********************************/

const FriendList = ({socket} : {socket:Socket | undefined}) => {
  const [active, setActive] = useState(false);
  const [userFriendList, setUserFriendList] = useState<User[]>([
    {id:0, pongUsername:"mescande", status:1},
    {id:1, pongUsername:"cdai", status:2},
    {id:2, pongUsername:"nader", status:0},
    {id:3, pongUsername:"sophie", status:0},
  ]);
  const api = new Api();

/*  useEffect(() => {
 *    socket?.on()
 *    return ( socket?.off()
  }, []);*/

  const showList = () => {
    setActive(!active);
  };

  return (
    <div className="absolute top-[120px] right-0 text-white bg-gray-800 rounded-b-md">
      <div
        className="p-2 flex flex-row-reverse items-center text-2xl font-bold"
        onClick={showList}
      >
        <BiChevronDown size={20} className={`${active && "rotate-180"}`} />
        <span className="px-4">Friend List</span>
      </div>

      {/************************* Dropdown Menu **************************/}
      <div
        className={
          active ? "bg-gray-700 mt-2 max-h-60 overflow-y-auto" : "hidden"
        }
      >
        <DropDownFriendList
          socket={socket}
          userFriendList={userFriendList}
        />
      </div>
    </div>
  );
};

export default FriendList;
