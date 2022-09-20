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
  /******* Url will be changed later ************************/
  let imageURL = "https://picsum.photos/400";

  const goToUserPage = () => {
    window.location.replace("http://localhost:8080/profile");
  };
  /***********************************************************/

  return (
    <>
      <div className="flex items-center font-bold">
        <span className="px-2">
          <BsCircleFill size="15" className={`${color}`} />
        </span>
        {group_name}
      </div>
      {friend_list?.map((friend) => {
        if (friend.status === group_status)
          return (
            <div
              key={friend.login}
              className={`grid grid-rows-3 grid-flow-col mx-2 cursor-pointer
              ${friend.nickname.startsWith(input) ? "block" : "hidden"}`}
            >
              <div
                className="row-span-2 px-4"
                onClick={goToUserPage}
              >
                <img src={imageURL} alt="Avatar" className="w-10 rounded-3xl" />
              </div>
              <span className="row-span-2 py-2">{friend.nickname}</span>
              {group_button_name ? (
                <button
                  className={`row-span-2 rounded-xl bg-gray-600 hover:bg-gray-800`}
                  onClick={handle_click}
                >
                {group_button_name}
                </button>
              ) : ("")
              }
            </div>
          );
      })}
    </>
  );
};

export default SubFriendList;
