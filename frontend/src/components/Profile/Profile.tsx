import React from "react";
import "./Profile.css";

import { useParams } from "react-router-dom";
import ProfileName from "./ProfileName";
import OneUserProfile from "./OneUserProfile";

const Profile = () => {
  const { login42 } = useParams();

  return (
    <div className="bg-black text-white h-screen grid grid-cols-10 grid-rows-6 gap-8">
      <div className="col-start-2 col-span-3 row-start-2">
        <ProfileName nickname={login42} />
      </div>

      {/* This part will change according to each user. Need to look into how to pass data */}
      <OneUserProfile nickname={login42} />
    </div>
  );
};

export default Profile;
