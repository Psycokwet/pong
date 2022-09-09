import React from 'react'
import StyledBall from './Ball.styles'

type Props = {
    x: number;
    y: number;
}
const Ball: React.FC<Props> = ({x, y}) => {
    return (
        <StyledBall x={x} y={y}/>
    )
}

export default Ball;