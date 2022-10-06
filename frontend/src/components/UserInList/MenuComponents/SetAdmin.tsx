import { MenuItem } from "@szhsin/react-menu";
import { Privileges } from "shared/interfaces/UserPrivilegesEnum";
import { MenuSettingsType } from "../MenuSettings";

const SetAdmin = ({ menuSettings }: { menuSettings: MenuSettingsType }) => {
  const setAdmin = () => {};
  return (
    <MenuItem
      className={menuSettings.privileges === Privileges.OWNER ? "" : "hidden"}
    >
      <div onClick={setAdmin}>Give Admin Rights</div>
    </MenuItem>
  );
};

export default SetAdmin;
