import styled from 'styled-components'
import { PADDLE_WIDTH, PADDLE_HEIGHT, GAME_WIDTH } from '../../gameHelper';

type Props = {
    type: string;
    position: number;
}

const StyledPaddle = styled.div<Props>`
    width: ${PADDLE_WIDTH}vw;
    height: ${PADDLE_HEIGHT}vh;
    background-color: white;
    position: absolute;
    top: ${(Props) => Props.position}vh;
    transform: translateY(-50%); // to get it to middle
    left: ${(Props) => Props.type === "left" ? 0 : GAME_WIDTH - PADDLE_WIDTH}vw;

`;

export default StyledPaddle;
