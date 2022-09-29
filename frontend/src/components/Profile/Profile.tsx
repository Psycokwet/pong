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

  const [avatarUrl, setAvatarUrl] = useState("");

  const { pongUsername } = useParams();

  useEffect(() => {
    api.get_user_profile(pongUsername).then((res: Response) => {
      console.log("get_user_profile", res);
      res.json().then((content) => {
        console.log(
          `get_user_profile is OK with pongUsername = ${pongUsername}`,
          content
        );
        setUserProfile(content);
      });
    });

    api.getPicture().then((res) => {
      if (res.status == 200)
        res.blob().then((myBlob) => {
          setAvatarUrl((current) => {
            console.log(`get_picture is Ok with pongUsername = ${pongUsername}`);
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(myBlob);
          });
        });
    });
  }, [pongUsername]);

  return (
    <div className="bg-black text-white h-screen">
      <OneUserProfile userProfile={userProfile} avatarUrl={avatarUrl} />
    </div>
  );
};

export default Profile;
