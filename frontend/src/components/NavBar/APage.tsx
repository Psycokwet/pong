import React from "react";
import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";

type Props = {
  url: string;
  pageName?: string;
  pageIcon: JSX.Element;
};

const APage: React.FC<Props> = ({ url, pageName, pageIcon }) => {
  return (
    <>
      <NavLink
        to={url}
        style={({ isActive }) => ({ color: isActive ? "green" : "white" })}
      >
        <>
          {/* ! Why this does not work? */}
          {pageIcon}
          <span className="navbar-page-name group-hover:scale-100">
            {pageName}
          </span>
        </>
      </NavLink>
    </>
  );
};

export default APage;
