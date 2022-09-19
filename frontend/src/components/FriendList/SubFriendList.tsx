import React from "react";
import FriendListItem from "./FriendListItem";

type SubFriendListProps = {
  listType: string;
  // user: [];
};

const SubFriendList: React.FC = ({ listType }) => {
  return (
    <div>
      <div>{listType}</div>
      <ul>
        <FriendListItem />
        <FriendListItem />
        <FriendListItem />
      </ul>
    </div>
  );
};

export default SubFriendList;
