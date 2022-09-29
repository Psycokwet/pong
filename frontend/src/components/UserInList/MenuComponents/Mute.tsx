import { MenuItem } from '@szhsin/react-menu';
import { Link } from "react-router-dom";

import { MenuSettingsType } from "../MenuSettings";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

const Mute = ({
  menuSettings,
  userOwnership,
}:{
  menuSettings:MenuSettingsType;
  userOwnership:number;
}) => {
  const mute = () => {
  }
  return (
    <MenuItem className={ menuSettings.privileges === Privileges.MEMBER ? "hidden" : "" }
      disabled={ userOwnership >= menuSettings.privileges }
    >
      <div onClick={mute}>Mute</div>
    </MenuItem>
  );
}

export default Mute
