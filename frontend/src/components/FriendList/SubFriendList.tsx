import React from "react";
import { userStatusEnum } from "./FriendList";
import { BsCircleFill } from "react-icons/bs";
import { Routes, Link } from "react-router-dom";

type SubFriendListProps = {
  friend_list: {
    login: string;
    nickname: string;
    status: userStatusEnum;
    image_url: string;
  }[];
  input: string;
  group_status: userStatusEnum;
  color: string;
  group_name: string;
  handle_click?: React.MouseEventHandler<HTMLButtonElement>;
  group_button_name?: string;
};

const SubFriendList: React.FC<SubFriendListProps> = ({
  friend_list,
  input,
  group_status,
  color,
  group_name,
  handle_click,
  group_button_name,
}) => {

  return (
    <>
      {/* Group Name */}
      <div className="flex items-center font-bold">
        <span className="px-2">
          <BsCircleFill size="15" className={`${color}`} />
        </span>
        {group_name}
      </div>

      {friend_list?.map((friend) => {
        if (friend.status === group_status)
          return (
            <ul
              key={friend.login}
              className={`grid grid-cols-2 grid-flow-col mx-2 cursor-pointer
              ${friend.nickname.startsWith(input) ? "block" : "hidden"}`}
            >
              {/* Avatar and Nickname */}
              <li>
                <Link
                  to={`/profile/${friend.login}`}
                  className="grid grid-cols-2 m-2"
                >
                  <img
                    src={friend.image_url}
                    alt="Avatar"
                    className="w-10 rounded-3xl"
                  />
                  <strong>{friend.nickname}</strong>
                </Link>
              </li>

              {/* Button */}
              {group_button_name ? (
                <button
                  className={`rounded-xl bg-gray-600 m-2 hover:bg-gray-800 ${color}`}
                  onClick={handle_click}
                >
                  {group_button_name}
                </button>
              ) : (
                ""
              )}
            </ul>
          );
      })}
    </>
  );
};

export default SubFriendList;
