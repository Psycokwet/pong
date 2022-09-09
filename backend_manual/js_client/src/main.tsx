import React from 'react'
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./components/App";
import './components/index.css'
import { Api, Bearer } from "./api/api";
import { createUser, getAuthenticated } from "./api_call_functions";

//here, mains.tsx will call both api_call_functions, you can see the detail in the webconsole
createUser()
getAuthenticated()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)