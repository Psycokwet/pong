import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  url: string;
  pageName: string;
};
const APage: React.FC<Props> = ({ url, pageName }) => {
  return (
    <li>
      <NavLink
        to={url}
        style={({ isActive }) => ({ color: isActive ? "yellow" : "white" })}
      >
        {pageName}
      </NavLink>
    </li>
  );
};

export default APage;
