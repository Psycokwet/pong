import { useState } from "react";
import { Api } from "../../api/api";

const api = new Api();

type Props = {
  updateCurrentUser: () => {};
};
const TwoStepSigningMockup: React.FC<Props> = ({ updateCurrentUser }) => {
  const [code2fa, setCode2fa] = useState<string>("");
  return (
    <>
      <input
        value={code2fa}
        onChange={(e) => setCode2fa(e.target.value)}
      ></input>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        onClick={() => {
          api.check_2fa(code2fa).then((res: Response) => {
            if (res.status >= 200 && res.status < 300) updateCurrentUser();
          });
        }}
      >
        2fa signin
      </button>
    </>
  );
};

export default TwoStepSigningMockup;
