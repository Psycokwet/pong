import "./App.css";
import LoginPage from "./LoginPage/LoginPage";
import { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBar";
import { DisconnectionButton } from "./ConnectionButton/DisconnectionButton";
import { Api } from "../api/api";
import { Loading } from "./Common/Loading";
enum connectionStatusEnum {
  Unknown,
  Connected,
  Disconnected
}
const api = new Api();
function App() {
  const [connectedState, setConnectedState] = useState(connectionStatusEnum.Unknown);

  useEffect(() => {
    if (connectedState == connectionStatusEnum.Unknown) {
      api.refreshToken().then((res) => {
        if (res.status !== 200) {
          console.log("set false")
          setConnectedState(connectionStatusEnum.Disconnected);
        }
        else {
          console.log("set true")
          setConnectedState(connectionStatusEnum.Connected);
        }
      });
    }
  }, [connectedState]);

  return connectedState == connectionStatusEnum.Unknown ? (
    <Loading></Loading>
  ) : (connectedState == connectionStatusEnum.Connected ? (
    <div>
      {/* <DisconnectionButton setDisconnected={() => setConnectedState(connectionStatusEnum.Disconnected)} /> */}
      <NavBar setDisconnected={() => setConnectedState(connectionStatusEnum.Disconnected)}/>
    </div>
  ) : (
    <LoginPage />
  )
  );
}

export default App;
