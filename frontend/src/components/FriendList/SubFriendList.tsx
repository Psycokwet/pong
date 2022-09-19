import React from "react";
import { userStatusEnum } from "./FriendList";
import { BsCircleFill } from "react-icons/bs";

type SubFriendListProps = {
  friend_list: {
    login: string;
    nickname: string;
    status: userStatusEnum;
    link_to_profile: string;
  }[];
  input: string;
  user_status: userStatusEnum;
  color: string;
  group_name: string;
};

const SubFriendList: React.FC<SubFriendListProps> = ({
  friend_list,
  input,
  user_status,
  color,
  group_name,
}) => {
  /******* Url will be changed later ************************/
  let imageURL = "https://picsum.photos/400";

  const goToUserPage = () => {
    window.location.replace("http://localhost:8080/profile");
  };
  /***********************************************************/

  return (
    <div className="w-40">
      <div className="flex items-center font-bold">
        <span className="text-green-600 px-2">
          <BsCircleFill size="15" className={` ${color}`} />
        </span>
        {group_name}
      </div>
      {friend_list?.map((friend) => {
        if (friend.status === user_status)
          return (
            <li
              key={friend.login}
              className={`flex items-center p-2 indent-2 hover:bg-sky-600 hover:text-white
              ${friend.nickname.startsWith(input) ? "block" : "hidden"}`}
              onClick={goToUserPage}
            >
              <img src={imageURL} alt="Avatar" className="w-8 rounded-3xl" />
              <strong>{friend.nickname}</strong>
            </li>
          );
      })}
    </div>
  );
};

export default SubFriendList;
