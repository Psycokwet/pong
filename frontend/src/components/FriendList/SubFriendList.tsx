import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { UserInterface } from "/shared/interfaces/User";
import Friend, { UserMenu } from "./Friend"
import { UserStatus } from "./DropDownFriendList"
import { Socket } from "socket.io-client";

type SubFriendListProps = {
  userFriendList: UserInterface[];
  input: string;
  subList: UserStatus;
  socket: Socket | undefined,
  roomId: number
  menu: UserMenu
};

const SubFriendList: React.FC<SubFriendListProps> = ({
  userFriendList,
  input,
  subList,
  socket,
  roomId,
  menu,
}) => {
  const filterList = (value:UserInterface) => {
    return (value.status === subList.status)
  }
  return (
    <>
      {/* Group Name */}
      <div className="flex items-center font-bold">
        <span className="px-2">
          <BsCircleFill size="15" className={`${subList.color}`} />
        </span>
        {subList.groupName}
      </div>

      {userFriendList?.filter(filterList).map((friend) => {
        return (
          <Friend
            friend={friend}
            input={input}
            socket={socket}
            menu={menu}
          />
        );
      })}
    </>
  );
};

export default SubFriendList;
