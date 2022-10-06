import React, { useState, useEffect } from "react";
import { Api } from "../../api/api";
import { useParams } from "react-router-dom";

import UserProfile from "/shared/interfaces/UserProfile";
import OneUserProfile from "./OneUserProfile";
import NotFound from "../NavBar/Pages-To-Change/NotFound";

const api = new Api();

const Profile = () => {
  const [userNotFound, setUserNotFound] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    pongUsername: "anonymous",
    userRank: { level: 0, userRank: 0 },
    userHistory: {
      nbGames: 0,
      nbWins: 0,
      games: [],
    },
  });
  const [avatarUrl, setAvatarUrl] = useState("");

  const { pongUsername } = useParams(); // get this from url: /practice/pongUsername

  useEffect(() => {
    api.get_user_profile(pongUsername).then((res: Response) => {
      if (res.status == 200)
        res.json().then((content) => {
          setUserProfile(content);
        });
      else setUserNotFound(true);
    });

    api.getPicture(pongUsername).then((res) => {
      if (res.status == 200)
        res.blob().then((myBlob) => {
          setAvatarUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(myBlob);
          });
        });
    });
  }, [pongUsername]);

  return (
    <div className="bg-black text-white h-screen">
      {userNotFound ? (
        <NotFound />
      ) : (
        <OneUserProfile userProfile={userProfile} avatarUrl={avatarUrl} />
      )}
    </div>
  );
};

export default Profile;
