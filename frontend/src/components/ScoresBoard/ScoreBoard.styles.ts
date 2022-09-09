import styled from 'styled-components'

export const StyledScoreBoard = styled.div`
    display: flex;
    justify-content: center;
    font-size: 3vh;
    
    `;

type Props = {
    side: string
}

export const StyledScore = styled.div<Props>`
    flex-grow: 1;
    flex-basis: 0;
    padding: 0 2vh;
    margin: 1vh 0;
    opacity: 0.6;
    text-align: ${(Props) => Props.side === "left" ? "right" : "left"};
    border-right : ${(Props) => Props.side === "left" ? ".5vh solid" : ""}
`;