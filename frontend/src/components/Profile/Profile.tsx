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
  const { login42 } = useParams();

  // api.get_user_rank().then((res: Response) => {
  //   console.log("get_user_rank is OK, here's the Response", res);
  //   if ((res.status / 200 >= 1 && res.status / 200 <= 2))
  //     res.json().then((content) => {
  //       console.log("get_user_rank is OK, here's the content", content);
  //       console.log(`level is: ${content.level}`)
  //       console.log(`rank is: ${content.userRank.rank}`)
  //     });
  // });

  return (
    <div className="bg-black text-white h-screen grid grid-cols-10 grid-rows-6 gap-8">
      <ProfilePic avatar={user_pic} setAvatar={setUserPic}/>
      <div className="col-start-2 col-span-3 row-start-2">
        <ProfileName nickname={login42} />
      </div>

      {/* This part will change according to each user. Need to look into how to pass data */}
      <OneUserProfile nickname={login42} />
    </div>
  );
};

export default Profile;
