import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { Api } from "../api/api";

// Components
import LoginPage from "./LoginPage/LoginPage";
import NavBar from "./NavBar/NavBar";
import FriendList from "./FriendList/FriendList";
import Loading from "./Common/Loading";
import NotFound from "./NavBar/Pages-To-Change/NotFound";
import { DisconnectionButton } from "./ConnectionButton/DisconnectionButton";
import PracticeJwt from "./PracticeJwt";
import Play from "./NavBar/Pages-To-Change/Play";
import Home from "./NavBar/Pages-To-Change/Home";
import Community from "./NavBar/Pages-To-Change/Community";
import LeaderBoard from "./NavBar/Pages-To-Change/LeaderBoard";
import Settings from "./NavBar/Pages-To-Change/Settings";
import ProfileRoutes from "./Profile/ProfileRoutes";
import Profile from "./Profile/Profile";
import OneUserProfile from "./Profile/OneUserProfile";

// Icon
import { FaComments } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { RiPingPongFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

enum connectionStatusEnum {
  Unknown,
  Connected,
  Disconnected,
}

const api = new Api();

/***************** To get with real data ******************************************/
let connected_user = "scarboni";
/********************************************************* */

const webPages = [
  {
    url: "/play",
    pageName: "play",
    element: <Play />,
    pageIcon: <RiPingPongFill size="28" />,
  },
  {
    url: "/leaderboard",
    pageName: "leader board",
    element: <LeaderBoard />,
    pageIcon: <HiChartBar size="28" />,
  },
  {
    url: "/community",
    pageName: "community",
    element: <Community />,
    pageIcon: <FaComments size="28" />,
  },
  {
    url: "/settings",
    pageName: "settings",
    element: <Settings />,
    pageIcon: <IoMdSettings size="26" />,
  },
  {
    url: "/practice",
    pageName: "practice",
    element: <PracticeJwt />,
    // pageIcon: <IoMdSettings size="26" />,
  },
];

function App() {
  const [connectedState, setConnectedState] = useState(
    connectionStatusEnum.Unknown
  );

  useEffect(() => {
    if (connectedState == connectionStatusEnum.Unknown) {
      api.refreshToken().then((res: Response) => {
        if (res.status !== 200) {
          console.log(res);
          setConnectedState(connectionStatusEnum.Disconnected);
        } else {
          setConnectedState(connectionStatusEnum.Connected);
        }
      });
    }
    const interval = setInterval(() => {
      setConnectedState(() => {
        api.refreshToken().then((res) => {
          if (res.status !== 200) {
            console.log(res);
            return connectionStatusEnum.Disconnected;
          } else {
            return connectionStatusEnum.Connected;
          }
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
    <div>
      <NavBar
        setDisconnected={() =>
          setConnectedState(connectionStatusEnum.Disconnected)
        }
      />
      <FriendList />
      <Routes>
        <Route path="/" element={<Home />} />
        {webPages.map((onePage, i) => {
          return <Route key={i} path={onePage.url} element={onePage.element} />;
        })}
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
