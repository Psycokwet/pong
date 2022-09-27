import React from "react";
import { PictureForm } from "../PictureForm/PictureForm";
import { Link } from "react-router-dom";
import { IoStarOutline } from "react-icons/io5";
import ProfileName from "./ProfileName";
import Stats from "./Stats/Stats";

function MatchHistory() {
  return (
    <div className="grid grid-cols-3 place-content-around place-items-center">
      <div>Date</div>
      <div>Score</div>
      <div>Opponent</div>
      <div>10/09 13:50</div>
      <div>10-2</div>
      <div>nickname</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
    </div>
  );
}

type OneUserProfileProps = {
  nickname?: string;
};

const OneUserProfile: React.FC<OneUserProfileProps> = ({ nickname }) => {
  return (
    <>
      <div className="row-start-2 row-span-3 col-start-6 col-span-3">
        <MatchHistory />
      </div>

      <div className="row-start-3 flex flex-row col-start-2 col-span-3 max-h-[22rem]">
        <div className="self-center">
          <Link to="/leaderboard">
            <IoStarOutline size="40" />
          </Link>
        </div>

        <div className="self-center">
          <Link to="/leaderboard">
            <h1 className="text-l font-mono font-semibold">1st !</h1>
          </Link>
        </div>
      </div>

      <div className="col-span-10" />

      <div className="col-start-2 col-span-3 row-span-3">
        <Stats />
      </div>

      <div className="col-start-6 col-span-3 row-start-5">
        <ProfileName nickname={nickname} />
      </div>

      <div className="col-span-10" />

    </>
  );
};

export default OneUserProfile;
