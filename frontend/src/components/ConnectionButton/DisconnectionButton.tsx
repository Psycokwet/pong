type DisconnectionButtonProps = {
  setDisconnected: CallableFunction;
};
import { Api } from "../../api/api";

const api = new Api();

export const DisconnectionButton = ({ setDisconnected }: DisconnectionButtonProps) => {

  const handleClick = () => {
    api.logout().then(() => setDisconnected());
  }

  return (
    <div>
      <button onClick={handleClick}>
        Signout
      </button>
    </div>
  );
}