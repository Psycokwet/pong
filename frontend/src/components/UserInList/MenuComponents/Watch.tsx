import { MenuItem } from '@szhsin/react-menu';
import { Link } from "react-router-dom";

import { MenuSettingsType } from "../MenuSettings";

const Watch = ({menuSettings}:{menuSettings:MenuSettingsType}) => {
  const watch = () => {}
  return (
    <MenuItem className={ menuSettings.watch ? "" : "hidden" }>
      <Link to="/play" onClick={watch}>Watch</Link>
    </MenuItem>
  );
}

export default Watch
