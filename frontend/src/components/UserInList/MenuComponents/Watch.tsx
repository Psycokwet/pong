import { MenuItem } from "@szhsin/react-menu";
import { useNavigate } from "react-router-dom";

import { MenuSettingsType } from "../MenuSettings";

const Watch = ({ menuSettings }: { menuSettings: MenuSettingsType }) => {
  const navigate = useNavigate();
  const watch = () => {
    navigate("/play");
  };
  return (
    <MenuItem className={menuSettings.watch ? "" : "hidden"} onClick={watch}>
      Watch
    </MenuItem>
  );
};

export default Watch;
