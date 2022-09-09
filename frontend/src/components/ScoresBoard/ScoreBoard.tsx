import React from 'react'
import { StyledScoreBoard, StyledScore } from './ScoreBoard.styles'

const ScoreBoard = () => {
  return (
    <StyledScoreBoard> 
        <StyledScore side="left">0</StyledScore>
        <StyledScore side="right">0</StyledScore>
    </StyledScoreBoard>
  )
}

export default ScoreBoard