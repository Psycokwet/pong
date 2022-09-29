import React from "react";
import { Link } from "react-router-dom";
import {DEFAULT_AVATAR} from "../Common/ProfilePic"
type UserNameProps = {
  pongUsername?: string;
  userPicture: string
};

const UserName: React.FC<UserNameProps> = ({ pongUsername, userPicture }) => {
  return (
    <div className="flex flex-row gap-8 self-center">
      <div className="bg-gray-900">
        {userPicture ? (
          <img src={userPicture} className="w-40 rounded-full" />
        ) : (
          <img
            src={DEFAULT_AVATAR}
            alt="Preview selected photo"
            className="w-40 rounded-full"
          />
        )}
      </div>
      <div className="self-center">
        <Link to="/profile">
          <h1 className="text-xl font-mono font-bold">{pongUsername} </h1>
        </Link>
      </div>
    </div>
  );
};

export default UserName;
