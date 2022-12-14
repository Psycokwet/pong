import { Api } from "../../api/api";
import { FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

type DisconnectionButtonProps = {
  setDisconnected: CallableFunction;
};

const api = new Api();

export const DisconnectionButton = ({
  setDisconnected,
}: DisconnectionButtonProps) => {
  const handleClick = () => {
    api.logout().then(() => setDisconnected());
  };

  return (
    <NavLink
      to="/"
      style={({ isActive }) => ({ color: isActive ? "" : "white" })}
      onClick={handleClick}
    >
      <FaSignOutAlt size="26" />
      <span className="navbar-page-name uppercase group-hover:scale-100">
        Sign Out
      </span>
    </NavLink>
  );
};
