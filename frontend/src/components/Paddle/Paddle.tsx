import React from 'react'
import StyledPaddle from './Paddle.styles'

type Props = {
    type: string;
    position: number;

}

const Paddle: React.FC<Props> = ({type, position}) => {
  return (
    <StyledPaddle type={type} position={position}/>
  )
}

export default Paddle