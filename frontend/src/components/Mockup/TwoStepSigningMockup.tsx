import React, { useState } from "react";
import { Api } from "../../api/api";

const api = new Api();

const TwoStepSigningMockup = () => {
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
            console.log("turn_on_2fa", res);
            res.json().then((content) => {
              console.log("turn_on_2fa", content);
            });
          });
        }}
      >
        turn on 2fa
      </button>
    </>
  );
};

export default TwoStepSigningMockup;
