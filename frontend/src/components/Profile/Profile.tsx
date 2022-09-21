import React, { useState, ComponentProps } from "react";
import "./Profile.css";

import Stats from "./Stats/Stats";
import { IoStarOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { PictureForm } from "../PictureForm/PictureForm";
import ProfileName from "./ProfileName"

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

export const Profile = () => {
  const {user_login} = useParams();

  return (
    <div className="bg-black text-white h-screen flex grid grid-cols-10 grid-rows-6 gap-8">
      <div className="col-start-2 col-span-3 row-start-2">
        <ProfileName />
      </div>
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
        <ProfileName />
      </div>
      <div className="col-span-10" />

      <PictureForm></PictureForm>
    </div>
  );
}

