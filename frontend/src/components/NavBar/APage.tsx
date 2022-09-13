import React from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";

type Props = {
  url: string;
  pageName?: string;
  pageIcon: IconType;
};

const APage: React.FC<Props> = ({ url, pageName, pageIcon }) => {
  return (
    <li className="navbar-icon group">
      <NavLink
        to={url}
        style={({ isActive }) => ({ color: isActive ? "green" : "white" })}
      >
        {/* ! Why this does not work? */}
        {pageIcon}
         <span className="navbar-page-name group-hover:scale-100">{pageName}</span>
      </NavLink>
    </li>
  );
};

export default APage;
