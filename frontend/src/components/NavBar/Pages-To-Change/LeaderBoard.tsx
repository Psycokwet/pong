import React from "react";
import { Api } from "../../../api/api";

const api = new Api();
const LeaderBoard = () => {
  const sendRequest = () => {
    api.add_friend("scarboni", "bob").then((res: Response) => {
      console.log(res);
      if (res.status != 200)
        res.json().then((content) => {
          console.log("add_friend", content);
        });
    });
    api.get_friend_list("scarboni").then((res: Response) => {
      console.log(res);
      res.json().then((content) => {
        console.log("get_friend_list", content);
      });
    });
    api.set_nickname("scarboni", "ponnnny").then((res: Response) => {
      console.log(res.status / 200 >= 1 && res.status / 200 <= 2, res);
      if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
        res.json().then((content) => {
          console.log("set_nickname", content);
        });
    });
    api.get_nickname("scarboni").then((res: Response) => {
      console.log(res);
      res.json().then((content) => {
        console.log("get_nickname", content);
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
