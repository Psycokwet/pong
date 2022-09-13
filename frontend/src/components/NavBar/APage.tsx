import React from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";

type Props = {
  url: string;
  pageName: string;
  pageIcon: IconType;
};

const APage: React.FC<Props> = ({ url, pageName, pageIcon }) => {
  return (
      <NavLink className="navbar-icon"
        to={url}
        style={({ isActive }) => ({ color: isActive ? "green" : "white" })}
      >
        {pageIcon}<span className="navbar-page-name">{pageName}</span>
      </NavLink>
  );
};

export default APage;
