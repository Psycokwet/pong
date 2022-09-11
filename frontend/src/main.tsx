import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./components/App";
import "./components/index.css";

// // This is a request example. See docker_compose.md to see how to hit the mockup or real backend, depending your needs.
// // Uncomment the following code to see what happens
// import { Api } from "./api/api";

// async function createUser() {
//   let api: Api = new Api();
//   return await Api.createUser(
//     "forgeronvirtuel",
//     "fdfg453GFHFgfh",
//     "socarboni@gmail.com"
//   );
// }
// createUser();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
