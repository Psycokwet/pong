import { MenuItem } from '@szhsin/react-menu';

import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { Privileges } from "/shared/interfaces/UserPrivilegesEnum";

import { MenuSettingsType } from "../MenuSettings";

const Ban = ({
  menuSettings,
  userOwnership
}:{
  menuSettings:MenuSettingsType;
  userOwnership:number;
})=>{
  const ban = () => {
  }
  return (
    <MenuItem className={ menuSettings.privileges === Privileges.MEMBER ? "hidden" : "" }
      disabled={ userOwnership >= menuSettings.privileges }
    >
      <div onClick={ban}>Ban from Channel</div>
    </MenuItem>
  );
}

export default Ban
