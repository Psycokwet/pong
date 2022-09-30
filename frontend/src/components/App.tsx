import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import io, { Socket } from "socket.io-client";

import { Api } from "../api/api";

// Components
import LoginPage from "./LoginPage/LoginPage";
import NavBar from "./NavBar/NavBar";
import FriendList from "./FriendList/FriendList";
import Loading from "./Common/Loading";
import NotFound from "./NavBar/Pages-To-Change/NotFound";
import PracticeJwt from "./PracticeJwt";
import Play from "./NavBar/Pages-To-Change/Play";
import Home from "./NavBar/Pages-To-Change/Home";
import Chat from "./Chat/Chat";
import LeaderBoard from "./NavBar/Pages-To-Change/LeaderBoard";
import Settings from "./NavBar/Pages-To-Change/Settings";
import Profile from "./Profile/Profile";
import OneUserProfile from "./Profile/OneUserProfile";

enum connectionStatusEnum {
  Unknown,
  Connected,
  Disconnected,
}

const api = new Api();

function App() {
  const [connectedState, setConnectedState] = useState(
    connectionStatusEnum.Unknown
  );
  const [socket, setSocket] = useState<Socket>();

  const webPageRoutes = [
    {
      url: "/play",
      element: <Play />,
    },
    {
      url: "/leaderboard",
      element: <LeaderBoard />,
    },
    {
      url: "/chat",
      element: <Chat socket={socket} />,
    },
    {
      url: "/settings",
      element: <Settings />,
    },
    {
      url: "/practice",
      element: <PracticeJwt />,
    },
  ];

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_PONG_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    if (connectedState == connectionStatusEnum.Unknown) {
      api.refreshToken().then((res: Response) => {
        if (res.status !== 200) {
          console.error(res);
          setConnectedState(connectionStatusEnum.Disconnected);
        } else {
          setConnectedState(connectionStatusEnum.Connected);
        }
      });
    }
    const interval = setInterval(() => {
      api.refreshToken().then((res) => {
        setConnectedState((current) => {
          let result = current;
          if (
            res.status !== 200 &&
            current !== connectionStatusEnum.Disconnected
          ) {
            console.error(res);
            result = connectionStatusEnum.Disconnected;
          } else if (
            res.status === 200 &&
            current !== connectionStatusEnum.Connected
          ) {
            result = connectionStatusEnum.Connected;
          }
          return result;
        });
      });
    }, 600_000);

    return () => {
      clearInterval(interval);
    };
  }, [connectedState]);

  return connectedState == connectionStatusEnum.Unknown ? (
    <Loading></Loading>
  ) : connectedState == connectionStatusEnum.Connected ? (
    <div className="h-screen">
      <NavBar
        setDisconnected={() =>
          setConnectedState(connectionStatusEnum.Disconnected)
        }
      />
      <FriendList socket={socket} />

      <Routes>
        {webPageRoutes.map((onePage, i) => {
          return <Route key={i} path={onePage.url} element={onePage.element} />;
        })}

        <Route path="/" element={<Home />} />

        <Route path="profile" element={<Profile />}>
          <Route path=":user_login" element={<OneUserProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  ) : (
    <LoginPage />
  );
}

export default App;
