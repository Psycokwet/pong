import { useState, useEffect } from "react";
import { ConnectionButton } from "./ConnectionButton/ConnectionButton";
import { DisconnectionButton } from "./ConnectionButton/DisconnectionButton";
import "./PracticeJwt.css";
import { Api } from "../api/api";
import { PictureForm } from "./PictureForm/PictureForm";
import WebsSocketCdaiTest from "./WebSocketCdaiTest/WebSocketCdaiTest";
import WebSocketCdaiTest from "./WebSocketCdaiTest/WebSocketCdaiTest";

//broken example component, I might even say, deprecated ;) To delete later
function PracticeJwt() {
  const [isConnected, setConnected] = useState(false);
  const [loopValue, setLoopValue] = useState(0);

  const api = new Api();

  const connectionLoop = () => {
    setLoopValue(
      setInterval(
        () =>
          api.refreshToken().then((res) => {
            if (res.status !== 200) {
              clearInterval(loopValue);
              setConnected(false);
              // window.location.replace("http://localhost:8080"); //to refresh
            }
          }),
        5000
      )
    );
  };

  useEffect(() => {
    api.refreshToken().then((res) => {
      if (res.status === 200) {
        //status from backend
        setConnected(true);
        connectionLoop();
      }
      // else
      //   window.location.r /eplace("http://localhost:8080/api/auth/42");
      // please replace the url on login page different than root of main page
    });
  }, []);

  return isConnected ? (
    <div className="App">
      <WebsSocketCdaiTest />
      <div>
        <DisconnectionButton setDisconnected={() => setConnected(false)} />
      </div>
    </div>
  ) : (
    <ConnectionButton />
  );
}

export default PracticeJwt;
