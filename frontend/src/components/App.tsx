import "./App.css";
import LoginPage from "./LoginPage/LoginPage";
import { useState, useEffect } from "react";
import NavBar from "./NavBar/NavBar";
import { Api } from "../api/api";
import { DisconnectionButton } from "./ConnectionButton/DisconnectionButton";

function App() {
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
              window.location.replace("http://localhost:8080"); //to refresh
            }
          }),
        5000
      )
    );
  };

  useEffect(() => {
    api.refreshToken().then((res) => {
      if (res.status === 200) {
        setConnected(true);
        connectionLoop();
      }
    });
  }, []);

  return isConnected ? (
    <div>
      <DisconnectionButton setConnected={setConnected} />
      <NavBar />
    </div>
  ) : (
    <LoginPage />
  );
}

export default App;
