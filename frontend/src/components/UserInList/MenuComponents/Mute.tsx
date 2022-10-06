import { MenuItem } from "@szhsin/react-menu";
import { MenuSettingsType } from "../MenuSettings";
import { Privileges } from "shared/interfaces/UserPrivilegesEnum";

const Mute = ({
  menuSettings,
  userPrivilege,
}: {
  menuSettings: MenuSettingsType;
  userPrivilege: number;
}) => {
  const do_mute = () => {};
  return (
    <MenuItem
      className={menuSettings.privileges === Privileges.MEMBER ? "hidden" : ""}
      disabled={userPrivilege >= menuSettings.privileges}
    >
      <div onClick={do_mute}>Mute</div>
    </MenuItem>
  );
};

export default Mute;
