import { Puff } from 'react-loading-icons'
import { useState } from "react";

const enum twoFactorSteps {
  BUTTON,
  LOADING,
  DONE,
}
const Button2fa = ({
  status,
  setStatus,
}:{
  status: number,
  setStatus: (status: number) => void,
})=>{
  const validateClick = () => {
    setStatus(twoFactorSteps.LOADING);
  };
  const result:JSX.Element[] = [
      <button className="border-4 border-gray-400 bg-gray-400 hover:border-gray-300 hover:bg-gray-300 transition rounded-md w-20 h-12" onClick={validateClick}>Validate</button>,
      <Puff stroke="#07e6ed" speed={1} className="h-12 w-20" onClick={()=>{setStatus(twoFactorSteps.DONE)}}/>,
      <button disabled={true} className="w-20 h-12 border-4 border-green-600 bg-green-600 transition rounded-md">Done !</button>,
  ];
  return result[status];
}

export default Button2fa
