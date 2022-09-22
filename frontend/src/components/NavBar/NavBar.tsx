import React from "react";
import { Link } from "react-router-dom";

// Components
import APage from "./APage";

// Icon
import { FaComments } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { RiPingPongFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { DisconnectionButton } from "../ConnectionButton/DisconnectionButton";

/***************** To change with real data ******************************************/
let connected_user = "scarboni";

/***************** List of Pages ******************************************/
export const NavBarPageList = [
  {
    url: "/play",
    pageName: "play",
    pageIcon: <RiPingPongFill size="28" />,
  },
  {
    url: "/leaderboard",
    pageName: "leader board",
    pageIcon: <HiChartBar size="28" />,
  },
  {
    url: "/community",
    pageName: "community",
    pageIcon: <FaComments size="28" />,
  },
  {
    url: `/profile/${connected_user}`, // to change with real user
    pageName: `profile ${connected_user}`, // to change with real user
    pageIcon: <FaUser size="26" />,
  },
  {
    url: "/settings",
    pageName: "settings",
    pageIcon: <IoMdSettings size="26" />,
  },
  {
    url: "/practice",
    pageName: "practice",
    // pageIcon: <IoMdSettings size="26" />,
  },
];

type DisconnectionButtonProps = {
  setDisconnected: CallableFunction;
};

/***************** Component NavBar ******************************************/
const NavBar: React.FC<DisconnectionButtonProps> = ({ setDisconnected }) => {
  return (
    <div>
      <nav className="border-b-8 border-sky-600 text-white">
        <ul className="flex p-6 uppercase bg-neutral-900">
          <li>
            <Link to="/" className="text-3xl font-bold ">
              Pinging Pong
            </Link>
          </li>
          {NavBarPageList.map((onePage, i) => {
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
          <li className="navbar-icon group">
            <DisconnectionButton setDisconnected={setDisconnected} />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
