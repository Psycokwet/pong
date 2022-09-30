import { FULL_ROUTE } from "../../../shared/httpsRoutes/routes";
import { PREFIX } from "../../api/api";

export const ConnectionButton = () => {
  return (
    <div>
      <a href={PREFIX + FULL_ROUTE.AUTH.ENDPOINT}>Connect with intra42</a>
    </div>
  );
};
