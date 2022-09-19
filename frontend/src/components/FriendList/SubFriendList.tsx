import React from "react";
import { userStatusEnum } from "./FriendList";
import { RiRadioButtonLine } from "react-icons/ri";

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
  group_name: string
};

const SubFriendList: React.FC<SubFriendListProps> = ({
  friend_list,
  input,
  user_status,
  color,
  group_name,
}) => {
  const goToUserPage = () => {
    window.location.replace("http://localhost:8080/profile");
  };

  return (
    <>
      <h1>{group_name}</h1>
      {friend_list?.map((friend) => {
        if (friend.status === user_status)
          return (
            <li
              key={friend.login}
              className={`flex justify-between p-2 hover:bg-sky-600 hover:text-white
              ${friend.nickname.startsWith(input) ? "block" : "hidden"}`}
              onClick={goToUserPage}
            >
              <span>{friend.nickname}</span>
              <span className="text-green-600">
                <RiRadioButtonLine size="15" className={color} />
              </span>
            </li>
          );
      })}
    </>
  );
};

export default SubFriendList;
