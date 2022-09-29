import React from "react";
import UserName from "./UserName";
import UserStats from "./UserStats";
import UserMatchHistory from "./UserMatchHistory";

import UserProfile from "shared/interfaces/UserProfile";

type OneUserProfileProps = {
  userProfile: UserProfile;
};

const OneUserProfile: React.FC<OneUserProfileProps> = ({userProfile}) => {
  return (
    <div>
      <div className="">
        <UserName pongUsername={userProfile.pongUsername} userPicture={userProfile.profilePicture} />
      </div>


      {/* <div className="row-start-2 row-span-3 col-start-6 col-span-3">
        <UserMatchHistory userHistory={userProfile.userHistory}/>
      </div> */}

      <div className="col-start-2 col-span-3 row-span-3">
        {/* <UserStats userStats={userProfile.userHistory} /> */}
      </div>

    </div>

  );
};

export default OneUserProfile;
