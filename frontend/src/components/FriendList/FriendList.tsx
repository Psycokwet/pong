import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { UserInterface } from "/shared/interfaces/UserInterface";
import { BiChevronDown } from "react-icons/bi";

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import DropDownFriendList from "./DropDownFriendList";




const FriendList = ({socket} : {socket:Socket | undefined}) => {
  const [active, setActive] = useState(false);
  const [userFriendList, setUserFriendList] = useState<UserInterface[]>([]);

  const ResetFriendList = (list:UserInterface[]) => {
    setUserFriendList(list);
  }
  useEffect(() => {
    socket?.emit(ROUTES_BASE.USER.FRIEND_LIST_REQUEST);
  }, []);
  useEffect(() => {
     socket?.on(ROUTES_BASE.USER.FRIEND_LIST_CONFIRMATION, ResetFriendList)
     return () => {
      socket?.off(ROUTES_BASE.USER.FRIEND_LIST_CONFIRMATION, ResetFriendList)}
  }, []);
  const AppendFriendList = (list:UserInterface) => {
    setUserFriendList((current) => [...current, list]);
  }
  useEffect(() => {
     socket?.on(ROUTES_BASE.USER.ADD_FRIEND_CONFIRMATION, AppendFriendList)
     return () => {
      socket?.off(ROUTES_BASE.USER.ADD_FRIEND_CONFIRMATION, AppendFriendList)}
  }, []);

  const UserStatusChange = (user:UserInterface) => {
    setUserFriendList((current) => {
      const old:UserInterface = current.find((val) => val === user);
      if (old) {
        console.log("in", old);
        return [...current.filter((value) => { value.pongUsername !== old.pongUsername }), old]
      }
      else{
        console.log("out", old);
        return current;
      }
    });
  }
  useEffect(() => {
    socket?.on(ROUTES_BASE.USER.CONNECTION_CHANGE, UserStatusChange);
    return () => {
      socket?.off(ROUTES_BASE.USER.CONNECTION_CHANGE, UserStatusChange);}
  }, []);


  return (
    <div className="absolute top-[120px] right-0 text-white bg-gray-800 rounded-b-md">
      <div
        className="p-2 flex flex-row-reverse items-center text-2xl font-bold"
        onClick={() => setActive(!active)}
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
