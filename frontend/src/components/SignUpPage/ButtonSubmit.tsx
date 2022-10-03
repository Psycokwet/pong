import { BsShieldFillExclamation } from "react-icons/bs"
import { Puff } from 'react-loading-icons'

const enum validForm {
  BUTTON,
  LOADING,
  DONE,
  ERROR,
}
const ButtonSubmit = ({
  validFormStatus,
  setValidFormStatus,
}:{
  validFormStatus: number,
  setValidFormStatus: (status: number) => void,
})=>{
  const validateClick = () => {
    setValidFormStatus(validForm.LOADING);
  };
  const result:JSX.Element[] = [
      <button
        className="border-4 border-gray-400 bg-gray-400 hover:border-gray-300 hover:bg-gray-300 transition rounded-md"
        onClick={validateClick}>
          Submit modifications
      </button>,

      <Puff
        stroke="#07e6ed"
        speed={1}
        className="h-12 transition w-20"
      />,

      <button
        disabled={true}
        className="w-20 h-12 border-4 border-green-800 bg-green-600 transition rounded-md">
          Done !
      </button>,

      <BsShieldFillExclamation
        onClick={() => setValidFormStatus(validForm.BUTTON)}
        className="w-20 h-12 transition text-red-600"
      />
  ];
  return result[validFormStatus];
}

export default ButtonSubmit
