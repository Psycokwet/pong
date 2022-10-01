import React from "react";
import UserStats from "./UserStats";
import UserMatchHistory from "./UserMatchHistory";

import UserProfile from "shared/interfaces/UserProfile";
import Avatar from "../Common/Avatar";

type OneUserProfileProps = {
  userProfile?: UserProfile;
  avatarUrl?: string;
};

const OneUserProfile: React.FC<OneUserProfileProps> = ({
  userProfile,
  avatarUrl,
}) => {
  return (
    <div className="flex justify-evenly">
      <div className="flex items-center">
        <Avatar url={avatarUrl} size="w-20" />
        <div className="p-2">
          <strong>{userProfile.pongUsername}</strong>
          <div>Level: {Math.floor(userProfile.userRank.level * 100) / 100}</div>
          <div>Rank : {userProfile.userRank.userRank.rank}</div>
        </div>
      </div>

      <div className="">
        <UserMatchHistory userHistory={userProfile.userHistory.games} />
      </div>

      <div className="">
        <UserStats
          nbGames={userProfile.userHistory.nbGames}
          nbWins={userProfile.userHistory.nbWins}
        />
      </div>
    </div>
  );
};

export default OneUserProfile;
