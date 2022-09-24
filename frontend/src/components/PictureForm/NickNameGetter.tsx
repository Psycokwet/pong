import React from "react";
import { Api } from "../../api/api";
import { useState } from "react";

const NickNameGetter = () => {
  const [userNickname, setUserNickName] = useState<string | null>(null);

  const api = new Api();

  const handleCick = (e) => {
    e.preventDefault();

    api.get_nickname("thi-nguy").then((res: Response) => {
      if (res.status == 200) {
        res.json().then((content) => {
          console.log("get_nickname is ok, result is: ", content);
        });
        setUserNickName("  something !!!")
      } else console.log(res.status);
    });
  };

  return (
    <div>
      <button onClick={handleCick}>View Uploaded NickName</button>
      <div>Nickname is set to: {userNickname}</div>
    </div>
  );
};

export default NickNameGetter;
