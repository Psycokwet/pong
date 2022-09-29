import React, { useState, useEffect } from "react";
import { Api } from "../../api/api";
import { useParams } from "react-router-dom";

import UserProfile from "shared/interfaces/UserProfile";
import OneUserProfile from "./OneUserProfile";

const api = new Api();

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    pongUsername: "anonymous",
    userRank: { level: NaN, userRank: NaN },
    userHistory: {
      nbGames: NaN,
      nbWins: NaN,
      games: [],
    },
    profilePicture: null,
  });

  const [urlProfilePic, setUrlProfilePic] = useState("")

  const { pongUsername } = useParams();

  useEffect(() => {
    api.get_user_profile(pongUsername).then((res: Response) => {
      console.log("get_user_profile", res);
      res.json().then((content) => {
        console.log(
          `get_user_profile with pongUsername = ${pongUsername}`,
          content
        );
        // if (content.profilePicture)
        //   setUrlProfilePic(URL.revokeObjectURL(content.profilePicture.blob()));
        setUserProfile(content);
      });
    });
  }, [pongUsername]);

  return (
    <div className="bg-black text-white h-screen">
      <OneUserProfile userProfile={userProfile} urlPic={urlProfilePic}/>
    </div>
  );
};

export default Profile;
