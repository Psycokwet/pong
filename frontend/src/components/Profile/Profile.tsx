import React from "react";
import "./Profile.css";

import { useParams } from "react-router-dom";
import ProfileName from "./ProfileName";
import OneUserProfile from "./OneUserProfile";

const Profile = () => {
  const { user_login } = useParams();

  return (
    <div className="bg-black text-white h-screen flex grid grid-cols-10 grid-rows-6 gap-8">
      <div className="col-start-2 col-span-3 row-start-2">
        <ProfileName nickname={user_login} />
      </div>

      {/* This part will change according to each user. Need to look into how to pass data */}
      <OneUserProfile nickname={user_login} />
    </div>
  );
};

export default Profile;
