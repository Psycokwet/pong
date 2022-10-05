import { Puff } from 'react-loading-icons'
import { BsShieldFillExclamation } from "react-icons/bs"
import buttonSteps from "./ButtonSteps"

const Button2fa = ({
  status,
  setStatus,
}:{
  status: number,
  setStatus: (status: number) => void,
})=>{
  const validateClick = () => {
    setStatus(buttonSteps.LOADING);
  };
  const result:JSX.Element[] = [
      <button
        className="border-4 border-gray-400 bg-gray-400 hover:border-gray-300 hover:bg-gray-300 transition rounded-md w-20 h-12"
        onClick={validateClick}>
          Validate
      </button>,

      <Puff 
        stroke="#07e6ed"
        speed={1}
        className="h-12 transition w-20"
      />,

      <button
        disabled={true}
        className="w-20 h-12 border-4 border-green-600 bg-green-600 transition rounded-md">
          Done !
      </button>,

      <BsShieldFillExclamation
        onClick={() => setStatus(buttonSteps.BUTTON)}
        className="w-20 h-12 transition text-red-600"
      />
  ];
  return result[status];
}

export default Button2fa
