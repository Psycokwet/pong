import styled from "styled-components";
import { BALL_SIZE } from "../../gameHelper";

type Props = {
    x: number;
    y: number;
};

const StyledBall = styled.div<Props>`
    position: absolute; // to GameBox
    transform: translate(-50%, -50%); // get to dead center
    left: ${(Props) => Props.x}vw; // works like x
    top: ${(Props) => Props.y}vh; // works like y
    width: ${BALL_SIZE}vw;
    height: ${BALL_SIZE}vw;
    border-radius: 50%;
    background-color: red;
`
export default StyledBall

