import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./Pages-To-Change/Home";
import Play from "./Pages-To-Change/Play";
import LeaderBoard from "./Pages-To-Change/LeaderBoard";
import Community from "./Pages-To-Change/Community";
import User from "./Pages-To-Change/User";
import NotFound from "./Pages-To-Change/NotFound";
import APage from "./APage";

// Icon
import { Si42 } from 'react-icons/si'
import { FaCog } from 'react-icons/fa'
import { FaComments } from 'react-icons/fa'
import { FaUser } from 'react-icons/fa'
import { FaGamepad } from 'react-icons/fa'
import { FaHome } from 'react-icons/fa'
import { HiChartBar } from 'react-icons/hi'
import { AiFillHome } from 'react-icons/ai'
import { RiPingPongFill } from 'react-icons/ri'

const webPages = [
  {
    url: "/",
    pageName: "Home",
    element: <Home />,
    pageIcon: <AiFillHome size="28" />,
  },
  {
    url: "/play",
    pageName: "play",
    element: <Play />,
    pageIcon: <RiPingPongFill size="32" />
  },
  {
    url: "/leaderboard",
    pageName: "leader board",
    element: <LeaderBoard />,
    pageIcon: <HiChartBar size="28" />
  },
  {
    url: "/community",
    pageName: "community",
    element: <Community />,
    pageIcon: <FaComments size="28" />
  },
  {
    url: "/user",
    pageName: "user",
    element: <User />,
    pageIcon: <FaUser size="26" />
  },
];

const NavBar = () => {
  return (
    <div>
      <div className="hidden md:flex justify-end gap-8 p-6 uppercase bg-slate-700">
          {webPages.map((onePage, key) => {
            return <APage url={onePage.url} pageName={onePage.pageName} pageIcon={onePage.pageIcon} />;
          })}
      </div>

      <Routes>
        {/* Only component Play will be rendered when we're at url /play */}
        {webPages.map((onePage, key) => {
          return <Route path={onePage.url} element={onePage.element} />;
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default NavBar;