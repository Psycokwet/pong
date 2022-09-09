import React from "react";
import StyledGameBox from "./GameBox.styles";
import Ball from "../Ball/Ball";
import Paddle from "../Paddle/Paddle";
import { PADDLE_POSITION, X_INIT, Y_INIT } from "../../gameHelper";
import ScoreBoard from "../ScoresBoard/ScoreBoard";

const GameBox = () => {
  return (
    <StyledGameBox>
      <ScoreBoard />
      <Ball x={X_INIT} y={Y_INIT} />
      <Paddle type="left" position={PADDLE_POSITION} />
      <Paddle type="right" position={PADDLE_POSITION} />
    </StyledGameBox>
  );
};

export default GameBox;
