import React from "react";
import { Link, Route, Routes } from "react-router-dom";

// Page Components
import Home from "./Pages-To-Change/Home";
import Play from "./Pages-To-Change/Play";
import LeaderBoard from "./Pages-To-Change/LeaderBoard";
import Community from "./Pages-To-Change/Community";
import Profile from "../Profile/Profile";
import Settings from "./Pages-To-Change/Settings";
import NotFound from "./Pages-To-Change/NotFound";
import APage from "./APage";

// Icon
import { FaComments } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { RiPingPongFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";

/***************** List of Pages ******************************************/
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
    url: "/profile",
    pageName: "profile",
    element: <Profile />,
    pageIcon: <FaUser size="26" />,
  },
  {
    url: "/settings",
    pageName: "settings",
    element: <Settings />,
    pageIcon: <IoMdSettings size="26" />,
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
      <nav className="border-b-8 border-sky-600 text-white">
        <ul className="flex p-6 uppercase bg-neutral-900">
          <li>
            <Link to="/" className="text-3xl font-bold ">Pinging Pong</Link>
          </li>
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
      </nav>

      <Routes>
        {webPages.map((onePage, i) => {
          return <Route key={i} path={onePage.url} element={onePage.element} />;
        })}
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default NavBar;
