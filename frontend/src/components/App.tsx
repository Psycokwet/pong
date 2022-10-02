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
import Play from "./NavBar/Pages-To-Change/Play";
import Home from "./NavBar/Pages-To-Change/Home";
import Chat from "./Chat/Chat";
import LeaderBoard from "./NavBar/Pages-To-Change/LeaderBoard";
import Profile from "./Profile/Profile";
import OneUserProfile from "./Profile/OneUserProfile";
import False42Login from "./LoginPage/False42Login";
import {
  createCurrentUserFrontInterface,
  CurrentUserFrontInterface,
} from "../../shared/interfaces/CurrentUserFrontInterface";
import { ConnectionStatus } from "../../shared/enumerations/ConnectionStatus";
import { isSameSimpleObj } from "../../shared/utils";
import TwoStepSigningMockup from "./Mockup/TwoStepSigningMockup";
import SignUpPage from "./SignUpPage/SignUpPage";

const api = new Api();

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUserFrontInterface>(
    createCurrentUserFrontInterface()
  );
  const updateCurrentUser = () => {
    api.refreshToken().then((res: Response) => {
      if (res.status != 200) {
        setCurrentUser((current: CurrentUserFrontInterface) => {
          if (current.status !== ConnectionStatus.NetworkUnavailable)
            return {
              ...current,
              status: ConnectionStatus.NetworkUnavailable,
            };
          return current;
        });
      } else {
        res.json().then((newCurrentUser: CurrentUserFrontInterface) => {
          console.log(newCurrentUser);
          setCurrentUser((current: CurrentUserFrontInterface) => {
            if (!isSameSimpleObj(current, newCurrentUser))
              return newCurrentUser;
            return current;
          });
        });
      }
    });
  };

  const [socket, setSocket] = useState<Socket>();
  const init_webPageRoutes = () => [
    {
      url: "/play",
      element: <Play socket={socket} />,
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
      element: (
        <SignUpPage
          updateCurrentUser={updateCurrentUser}
          pongUsername={currentUser.pongUsername}
        />
      ),
    },
  ];

  const [webPageRoutes, setWebPagesRoutes] = useState(init_webPageRoutes());

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_PONG_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    setWebPagesRoutes(init_webPageRoutes());
  }, [socket, currentUser]);

  useEffect(() => {
    if (currentUser.status == ConnectionStatus.Unknown) {
      updateCurrentUser();
    }
    const interval = setInterval(() => {
      updateCurrentUser();
      socket?.disconnect();
      socket?.connect();
    }, 600_000);
    return () => {
      clearInterval(interval);
    };
  }, [currentUser.status]);

  switch (currentUser.status) {
    case ConnectionStatus.Unknown:
      return <Loading></Loading>;
    case ConnectionStatus.Connected:
      return (
        <div className="h-screen">
          <NavBar
            setDisconnected={() =>
              setCurrentUser((current) => {
                return { ...current, status: ConnectionStatus.Disconnected };
              })
            }
            pongUsername={currentUser.pongUsername}
          />
          <FriendList socket={socket} />

          <Routes>
            {webPageRoutes.map((onePage, i) => {
              return (
                <Route key={i} path={onePage.url} element={onePage.element} />
              );
            })}

            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />}>
              <Route path=":pongUsername" element={<OneUserProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      );
    case ConnectionStatus.Disconnected:
    case ConnectionStatus.NetworkUnavailable:
      return (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/false42login" element={<False42Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    case ConnectionStatus.SignupRequested:
      return (
        <SignUpPage
          updateCurrentUser={updateCurrentUser}
          pongUsername={currentUser.pongUsername}
        ></SignUpPage>
      );
    case ConnectionStatus.TwoFactorAuthenticationRequested:
      return (
        <TwoStepSigningMockup
          updateCurrentUser={updateCurrentUser}
        ></TwoStepSigningMockup>
      );
    default:
      return <>This should never happen.</>;
  }
}

export default App;
