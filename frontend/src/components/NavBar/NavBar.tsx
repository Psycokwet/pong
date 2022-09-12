import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./Pages-To-Change/Home";
import Play from "./Pages-To-Change/Play";
import LeaderBoard from "./Pages-To-Change/LeaderBoard";
import Community from "./Pages-To-Change/Community";
import User from "./Pages-To-Change/User";
import NotFound from "./Pages-To-Change/NotFound";
import APage from "./APage";

const webPages = [
  {
    url: "/",
    pageName: "Home",
    element: <Home />,
  },
  {
    url: "/play",
    pageName: "play",
    element: <Play />,
  },
  {
    url: "/leaderboard",
    pageName: "leader board",
    element: <LeaderBoard />,
  },
  {
    url: "/community",
    pageName: "community",
    element: <Community />,
  },
  {
    url: "/user",
    pageName: "user",
    element: <User />,
  },
];

const NavBar = () => {
  return (
    <div>
      <nav>
        <ul className="hidden md:flex gap-8 p-6 uppercase bg-slate-600">
          {webPages.map((onePage, key) => {
            return <APage url={onePage.url} pageName={onePage.pageName} />;
          })}
        </ul>
      </nav>

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