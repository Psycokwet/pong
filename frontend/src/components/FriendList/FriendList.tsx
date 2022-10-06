import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import { UserInterface } from "shared/interfaces/UserInterface";
import { ROUTES_BASE } from "shared/websocketRoutes/routes";

import DropDownFriendList from "./DropDownFriendList";

const FriendList = ({ socket }: { socket: Socket | undefined }) => {
  const [active, setActive] = useState(false);
  const [userFriendList, setUserFriendList] = useState<UserInterface[]>([]);

  const resetFriendList = (list: UserInterface[]) => {
    setUserFriendList(list);
  };
  useEffect(() => {
    socket?.emit(ROUTES_BASE.USER.FRIEND_LIST_REQUEST);
  }, []);
  useEffect(() => {
    socket?.on(ROUTES_BASE.USER.FRIEND_LIST_CONFIRMATION, resetFriendList);
    return () => {
      socket?.off(ROUTES_BASE.USER.FRIEND_LIST_CONFIRMATION, resetFriendList);
    };
  }, []);

  const appendFriendList = (newUser: UserInterface) => {
    setUserFriendList((current: UserInterface[]) => [...current, newUser]);
  };

  useEffect(() => {
    socket?.on(ROUTES_BASE.USER.ADD_FRIEND_CONFIRMATION, appendFriendList);
    return () => {
      socket?.off(ROUTES_BASE.USER.ADD_FRIEND_CONFIRMATION, appendFriendList);
    };
  }, []);

  const userStatusChange = (newUserData: UserInterface) => {
    const alreadyExistUser: UserInterface | undefined= userFriendList.find(
      (user: UserInterface) => user.id === newUserData.id
    );
    if (alreadyExistUser)
      setUserFriendList((current: UserInterface[]) => [
        ...current.filter(
          (user: UserInterface) => user.id !== alreadyExistUser.id
        ),
        newUserData,
      ]);
  };
  useEffect(() => {
    socket?.on(ROUTES_BASE.USER.CONNECTION_CHANGE, userStatusChange);
    return () => {
      socket?.off(ROUTES_BASE.USER.CONNECTION_CHANGE, userStatusChange);
    };
  }, []);

  return (
    <div className="h-7/8 text-white bg-gray-900 rounded-b-md">
      <h1 className="text-4xl font-bold self-center">Friend List</h1>

      {/************************* Dropdown Menu **************************/}
      <div className="bg-gray-700 mt-2 max-h-60 overflow-y-auto">
        <DropDownFriendList socket={socket} userFriendList={userFriendList} />
      </div>
    </div>
  );
};

export default FriendList;
