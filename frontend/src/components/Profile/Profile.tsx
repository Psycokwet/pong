import React, { useState, useEffect } from "react";
import { Api } from "../../api/api";
import { useParams } from "react-router-dom";

import UserProfile from "shared/interfaces/UserProfile";
import OneUserProfile from "./OneUserProfile";

const api = new Api();

const Profile = () => {
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

  const [localPongUsername, setLocalPongUsername] = useState(pongUsername);
  useEffect(() => {
    setLocalPongUsername(pongUsername);
  }, [pongUsername]);

  useEffect(() => {
    api.get_user_profile(localPongUsername).then((res: Response) => {
      if (res.status == 200)
        res.json().then((content) => {
          setUserProfile(content);
        });
    });

    api.getPicture(localPongUsername).then((res) => {
      if (res.status == 200)
        res.blob().then((myBlob) => {
          setAvatarUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(myBlob);
          });
        });
    });
  }, [localPongUsername]);

  return (
    <div className="bg-black text-white h-screen">
      <OneUserProfile userProfile={userProfile} avatarUrl={avatarUrl} />
    </div>
  );
};

export default Profile;
