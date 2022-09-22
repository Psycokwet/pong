import React from "react";
import { Api } from "../../../api/api";

const api = new Api();
const LeaderBoard = () => {
  const sendRequest = () => {
    api.add_friend("scarboni", "bob").then((res: Response) => {
      console.log("add_friend", res);
      if (res.status != 200)
        res.json().then((content) => {
          console.log("add_friend", content);
        });
    });
    api.get_friend_list("scarboni").then((res: Response) => {
      console.log("get_friend_list", res);
      res.json().then((content) => {
        console.log("get_friend_list", content);
      });
    });
    api.set_nickname("ponnnny").then((res: Response) => {
      console.log("set_nickname", res);
      if (!(res.status / 200 >= 1 && res.status / 200 <= 2))
        res.json().then((content) => {
          console.log("set_nickname", content);
        });
    });
    api.get_nickname("scarboni").then((res: Response) => {
      console.log("get_nickname", res);
      res.json().then((content) => {
        console.log("get_nickname", content);
      });
    });
  };
  const sendRequestHisRank = () => {
    api.get_user_rank().then((res: Response) => {
      console.log("get_user_rank", res);
      res.json().then((content) => {
        console.log("get_user_rank", content);
      });
    });
    api.get_user_history().then((res: Response) => {
      console.log("get_user_history", res);
      res.json().then((content) => {
        console.log("get_user_history", content);
      });
    });
    api.add_played_game("scarboni", "bob", "scarboni").then((res: Response) => {
      console.log("add_played_game", res);
      res.json().then((content) => {
        console.log("add_played_game", content);
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
      <h1 className="text-amber-600">I'm practice request page</h1>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        onClick={sendRequestHisRank}
      >
        send requests history/rank
      </button>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        onClick={() => {
          api.turn_off_2fa().then((res: Response) => {
            console.log("turn_off_2fa", res);
            res.json().then((content) => {
              console.log("turn_off_2fa", content);
            });
          });
        }}
      >
        turn off 2fa
      </button>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        onClick={() => {
          api.turn_on_2fa().then((res: Response) => {
            console.log("turn_on_2fa", res);
            res.json().then((content) => {
              console.log("turn_on_2fa", content);
            });
          });
        }}
      >
        turn on 2fa
      </button>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-3xl rounded-3xl p-4 shadow-md shadow-blue-500/50"
        onClick={() => {
          api.get_2fa().then((res: Response) => {
            console.log("get_2fa", res);
            res.json().then((content) => {
              console.log("get_2fa", content);
            });
          });
        }}
      >
        get 2fa
      </button>
    </>
  );
};

export default LeaderBoard;
