import React from "react";
import { Api } from "../../../api/api";

const api = new Api();
const LeaderBoard = () => {
  const sendRequest = () => {
    api.get_friend_list("scarboni").then((res: Response) => {
      console.log(res);
      res.json().then((content) => {
        console.log("get_friend_list", content);
      });
    });
  };
  return (
    <>
      <h1 className="text-amber-600">I'm practice request page</h1>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        onClick={sendRequest}
      >
        send request
      </button>
    </>
  );
};

export default LeaderBoard;
