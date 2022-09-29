import React, { useEffect } from "react";
import "./Profile.css";

import { useParams } from "react-router-dom";
import ProfileName from "./ProfileName";
import OneUserProfile from "./OneUserProfile";
import { Api } from "../../api/api";
import ProfilePic from "../Common/ProfilePic";
import { useState } from "react";

const api = new Api();

const Profile = () => {
  const [user_pic, setUserPic] = useState("");
  const [userProfile, setUserProfile] = useState(null)
  const { pongUsername } = useParams();

  useEffect(() => {
    api.get_user_profile(pongUsername).then((res: Response) => {
      console.log("get_user_profile", res);
      res.json().then((content) => {
        console.log(`get_user_profile with pongUsername = ${pongUsername}`, content);
        setUserProfile(content);
      });
    });
  }, [pongUsername]);

  return (
    <div className="bg-black text-white h-screen grid grid-cols-10 grid-rows-6 gap-8">
      <ProfilePic avatar={user_pic} setAvatar={setUserPic} />
      <div className="col-start-2 col-span-3 row-start-2">
        <ProfileName nickname={pongUsername} />
      </div>

      {/* This part will change according to each user. Need to look into how to pass data */}
      <OneUserProfile nickname={pongUsername} />
    </div>
  );
};

export default Profile;
