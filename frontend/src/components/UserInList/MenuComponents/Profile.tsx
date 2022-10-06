import { MenuItem } from "@szhsin/react-menu";
import { Link } from "react-router-dom";

import { UserInterface } from "/shared/interfaces/UserInterface";

import { MenuSettingsType } from "../MenuSettings";

const Profile = ({ user }: { user: UserInterface }) => {
  return (
    <MenuItem>
      <Link to={`/profile/${user.pongUsername}`}>SeeProfile</Link>
    </MenuItem>
  );
};

export default Profile;
