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
  // const [loopValue, setLoopValue] = useState(0);


  // const connectionLoop = () => {
  //   setLoopValue(

  //   );
  // };

  useEffect(() => {

    if (connectedState == connectionStatusEnum.Unknown) {
      api.refreshToken().then((res) => {
        if (res.status !== 200) {
          // clearInterval(loopValue);
          console.log("set false")

          setConnectedState(connectionStatusEnum.Disconnected);
          // window.location.replace("http://localhost:8080"); //to refresh
        }
        else {
          console.log("set true")
          setConnectedState(connectionStatusEnum.Connected);
        }
      });
    }
    //   // let interval: number;
    //   // if (!isConnected) {
    //   //   interval = setInterval(
    //   //     () =>
    //   api.refreshToken().then((res) => {
    //     if (res.status !== 200) {
    //       // clearInterval(loopValue);
    //       console.log(isConnected, "set false")

    //       setConnected(false);
    //       window.location.replace("http://localhost:8080"); //to refresh
    //     }
    //     console.log(isConnected, "set true")
    //     setConnected(true);
    //   });
    //   //       }),
    //   //     5000
    //   //   );
    //   // }
    //   // api.refreshToken().then((res) => {
    //   //   if (res.status === 200) {
    //   //     setConnected(true);
    //   //     connectionLoop();
    //   //   }
    //   // return () => {
    //   //   if (!isConnected) clearInterval(interval)
    //   // }

  }, [connectedState]);

  return connectedState == connectionStatusEnum.Unknown ? (
    <Loading></Loading>
  ) : (connectedState == connectionStatusEnum.Connected ? (
    <div>
      <DisconnectionButton setDisconnected={() => setConnectedState(connectionStatusEnum.Disconnected)} />
      <NavBar />
    </div>
  ) : (
    <LoginPage />
  )
  );
}

export default App;
