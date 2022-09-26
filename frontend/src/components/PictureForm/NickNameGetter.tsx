import React from "react";
import { Api } from "../../api/api";
import { useState } from "react";

const NickNameGetter = () => {
  const [pongUsername, setPongUsername] = useState<string | null>(null);

  const api = new Api();

  const handleClick = (e: React. MouseEvent<HTMLElement>) => {
    e.preventDefault();

    api.get_nickname("thi-nguy").then((res: Response) => {
      if (res.status == 200) {
        res.json().then((content) => {
          console.log("get_nickname is ok, result is: ", content);
          setPongUsername(content.pongUsername);
        });
      } else console.log(res.status);
    });
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
      >
        View Uploaded NickName:
      </button>
      <div>Nickname is set to: {pongUsername}</div>
    </div>
  );
};

export default NickNameGetter;
