import { MenuItem } from "@szhsin/react-menu";
import { Privileges } from "shared/interfaces/UserPrivilegesEnum";
import { MenuSettingsType } from "../MenuSettings";

const Ban = ({
  menuSettings,
  userPrivilege,
}: {
  menuSettings: MenuSettingsType;
  userPrivilege: number;
}) => {
  const ban = () => {};
  return (
    <MenuItem
      className={menuSettings.privileges === Privileges.MEMBER ? "hidden" : ""}
      disabled={userPrivilege >= menuSettings.privileges}
    >
      <div onClick={ban}>Ban from Channel</div>
    </MenuItem>
  );
};

export default Ban;
