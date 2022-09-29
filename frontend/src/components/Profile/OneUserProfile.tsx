import React from "react";
import UserStats from "./UserStats";
import UserMatchHistory from "./UserMatchHistory";

import UserProfile from "shared/interfaces/UserProfile";
import Avatar from "../Common/Avatar"

type OneUserProfileProps = {
  userProfile: UserProfile;
};

const OneUserProfile: React.FC<OneUserProfileProps> = ({
  userProfile,
}) => {
  return (
    <div>
      <div>{userProfile.pongUsername}</div>
      <div>
        <Avatar url={userProfile.profilePicture} />
      </div>

      <div>Level: {userProfile.userRank.level}</div>
      <div>Rank : {userProfile.userRank.userRank.rank}</div>

      <div className="row-start-2 row-span-3 col-start-6 col-span-3">
        {/* <UserMatchHistory userHistory={userProfile.userHistory.games}/> */}
      </div>

      <div className="col-start-2 col-span-3 row-span-3">
        <UserStats
          nbGames={userProfile.userHistory.nbGames}
          nbWins={userProfile.userHistory.nbWins}
        />
      </div>
    </div>
  );
};

export default OneUserProfile;
