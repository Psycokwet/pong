import styled from "styled-components";
import { GAME_WIDTH, GAME_HEIGHT } from "../../gameHelper";

const StyledGameBox = styled.div`
    width: ${GAME_WIDTH}vw;
    height: ${GAME_HEIGHT}vh;
    background-color: black;
    border-style: double;
    border-color: white;
    position: relative;
    left: 10px;
    top: 20px;
    // ! Need to add max-width, max-height
    
`
export default StyledGameBox