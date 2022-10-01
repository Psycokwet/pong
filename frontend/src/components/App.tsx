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
import False42Login from "./LoginPage/False42Login";
import { CurrentUser } from "../../shared/interfaces/CurrentUser";
import { ConnectionStatus } from "../../shared/enumerations/ConnectionStatus";

const api = new Api();

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    status: ConnectionStatus.Unknown,
  } as CurrentUser);
  const [socket, setSocket] = useState<Socket>();

  const webPageRoutes = [
    {
      url: "/play",
      element: <Play socket={socket}/>,
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
    if (currentUser.status == ConnectionStatus.Unknown) {
      api.refreshToken().then((res: Response) => {
        res.json().then((newCurrentUser: CurrentUser) => {
          console.log(newCurrentUser);
          setCurrentUser((current: CurrentUser) => {
            if (current.status !== newCurrentUser.status) return newCurrentUser;
            return current;
          });
        });
      });
    }
    const interval = setInterval(() => {
      api.refreshToken().then((res: Response) => {
        res.json().then((newCurrentUser: CurrentUser) => {
          console.log(newCurrentUser);
          setCurrentUser((current: CurrentUser) => {
            if (current.status !== newCurrentUser.status) return newCurrentUser;
            return current;
          });
        });
      });
      socket?.disconnect();
      socket?.connect();
    }, 600_000);

    return () => {
      clearInterval(interval);
    };
  }, [currentUser.status]);

  return currentUser.status == ConnectionStatus.Unknown ? (
    <Loading></Loading>
  ) : currentUser.status == ConnectionStatus.Connected ? (
    <div className="h-screen">
      <NavBar
        setDisconnected={() =>
          setCurrentUser((current) => {
            return { ...current, status: ConnectionStatus.Disconnected };
          })
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
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/false42login" element={<False42Login />} />
    </Routes>
  );
}

export default App;
