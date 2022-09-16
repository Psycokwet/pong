import { useState, useEffect } from "react";
import { ConnectionButton } from './ConnectionButton/ConnectionButton';
import { DisconnectionButton } from './ConnectionButton/DisconnectionButton';
import "./PracticeJwt.css";
import { Api } from "../api/api";

function PracticeJwt() {
  const [count, setCount] = useState(0);

  const [connected, setConnected] = useState(false);

  const api = new Api()

  useEffect(() => {
    api.ping()
      .then(res => {
        if (res.status === 200)
          setConnected(true)
        // else
        //   window.location.replace("http://localhost:8080/api/auth/42");
        // please replace the url on login page different than root of main page
      })
    },
    []
  )

  return (
    connected ? <div className="App">
      <DisconnectionButton setConnected={setConnected} />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="https://seeklogo.com/images/V/vite-logo-BFD4283991-seeklogo.com.png" 
          className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" alt="Vite logo" />
        </a>
      </div>      
      <h1>Vite + React + Typescript</h1>
      <div className="card">
        <button className="border-solid" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
        <img
          className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
          src="https://pbs.twimg.com/media/DUfDNvTVQAA2osS.jpg:large"
          alt="Happy Cat"
        />
        <div className="text-center space-y-2 sm:text-left">
          <div className="space-y-0.5">
            <p className="text-lg text-black font-semibold">Erin Lindford</p>
            <p className="text-slate-500 font-medium">Litters Manager</p>
          </div>
          <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
            Message
          </button>
        </div>
      </div>
    </div> : <ConnectionButton/>

  );
}

export default PracticeJwt;
