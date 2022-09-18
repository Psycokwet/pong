import React from "react";

const FriendList = () => {
  return (
    <div className="text-white flex flex-col bg-gray-900 border-4">
        <div className="text-2xl font-bold p-4">Friend List</div>
        <ul >
            <li>Online</li>
            <li>Playing</li>
            <li>Offline</li>
        </ul>
    </div>
  );
};

export default FriendList;
