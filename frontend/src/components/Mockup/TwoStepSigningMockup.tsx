import { useState, useEffect } from "react";
import { Api } from "../../api/api";
import buttonSteps from "../SignUpPage/ButtonSteps"
import Button2fa from "../SignUpPage/Button2fa";

const api = new Api();

const TwoStepSigningMockup = ({updateCurrentUser} : {
  updateCurrentUser:() => void
})=>{
  const [code2fa, setCode2fa] = useState<string>("");
  const [status, setStatus] = useState<number>(buttonSteps.BUTTON);
  useEffect(() => {
    if (status === buttonSteps.LOADING) {
      const tmpCode:string = code2fa;
      setCode2fa("");
      api.turn_on_2fa(tmpCode).then((res: Response) => {
        if (res.status === 401)
          setStatus(buttonSteps.ERROR);
        if (res.status === 201)
        {
          setStatus(buttonSteps.DONE);
          updateCurrentUser();
        }
      });
    }
  }, [status]);
  return (
    <div className="text-white h-screen bg-gray-900 items-center flex flex-col gap-4 justify-center">
      <h1 className="font-bold text-3xl text-center">
        Please Verify your Authentication via
        <br/>
        the Google Authenticator code
      </h1>
      <input
        type="text"
        placeholder="Enter Code"
        value={code2fa}
        onChange={(e) => {
          setCode2fa(e.target.value);
          setStatus(buttonSteps.BUTTON);
        }}
        maxLength={6}
        className="text-white bg-gray-600 placeholder:text-gray-400 placeholder:px-4 outline_none rounded-xl w-60 border-8 border-gray-600 text-center"
      />
      <Button2fa text="Verify" status={status} setStatus={setStatus}/>
    </div>
  );
};

export default TwoStepSigningMockup;
