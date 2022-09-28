import React from "react";
import { BsCircleFill } from "react-icons/bs";
import { User } from "/shared/interfaces/User";
import Friend from "./Friend"
import { UserStatus } from "./DropDownFriendList"
import { Socket } from "socket.io-client";
import { UserMenu } from "./Friend"

type SubFriendListProps = {
  userFriendList: User[];
  input: string;
  subList: UserStatus;
  socket: Socket | undefined
};

const SubFriendList: React.FC<SubFriendListProps> = ({
  userFriendList,
  input,
  subList,
  socket,
}) => {
  const filterList = (value:User) => {
    return (value.status === subList.status)
  }
  const menu:UserMenu = {
    challenge:subList.status===online,
    watch:subList.status===playing,
    ban:false,
    mute:false,
    setAdmin:false,
    isAdmin:false,
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
