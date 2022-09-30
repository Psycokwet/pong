import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./components/App";
import "./components/index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
