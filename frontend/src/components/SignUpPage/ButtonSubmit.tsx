import { BsShieldFillExclamation } from "react-icons/bs"
import { useState } from "react";

const enum twoFactorSteps {
  BUTTON,
  LOADING,
  DONE,
  ERROR,
}
const ButtonSubmit = ({
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
      <button disabled={true} className="w-20 h-12 border-4 border-green-800 bg-green-600 transition rounded-md">Done !</button>,
      <BsShieldFillExclamation className="w-20 h-12 transition text-red-600"/>
  ];
  return result[status];
}

export default ButtonSubmit
