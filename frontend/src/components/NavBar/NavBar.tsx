import React from "react";
import { Route, Routes } from "react-router-dom";

// Page Components
import Home from "./Pages-To-Change/Home";
import Play from "./Pages-To-Change/Play";
import LeaderBoard from "./Pages-To-Change/LeaderBoard";
import Community from "./Pages-To-Change/Community";
import User from "./Pages-To-Change/User";
import NotFound from "./Pages-To-Change/NotFound";
import APage from "./APage";

// Icon
import { FaComments } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { AiFillHome } from "react-icons/ai";
import { RiPingPongFill } from "react-icons/ri";

/***************** List of Pages ******************************************/
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
    url: "/user",
    pageName: "user",
    element: <User />,
    pageIcon: <FaUser size="26" />,
  },
];

/***************** Component NavBar ******************************************/
const NavBar = () => {
  /******************************************************** 
  Can be useful if we want to do NavBar for phone version 
  ********************************************************/
  // const [active, setActive] = useState(false);
  // const showMenu = () => {
  //   setActive(!active);
  // };

  return (
    <div>
      <ul className="flex p-6 uppercase bg-slate-700">
        {webPages.map((onePage, i) => {
          return (
            <li key={i} className="navbar-icon group">
              <APage
                url={onePage.url}
                pageName={onePage.pageName}
                pageIcon={onePage.pageIcon}
              />
            </li>
          );
        })}
      </ul>

      <Routes>
        {webPages.map((onePage, i) => {
          return <Route key={i} path={onePage.url} element={onePage.element} />;
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default NavBar;
