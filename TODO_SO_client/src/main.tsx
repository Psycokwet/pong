import React from 'react'
import ReactDOM, { createRoot } from "react-dom/client";
import App from "./components/App";
import './components/index.css'
import { Api, Bearer } from "./api/api";

async function getAuthenticated() {
  let api: Api = new Api()
  Api.auth("forgeronvirtuel", "$eR477688910")
    .then<void | Bearer>(r => {
      if (!r) return;
      if (r.status === 201) return r.json()
      else r.json().then(console.error)
    })
    .then<void | Response>(d => {
      console.log("Bearer jsonified")
      if (!d) return
      api.setToken(d.access_token)
      return api.hello()
    })
    .then<void | any>(r => {
      console.log("Hello response")
      if (!r) return
      if (r.status === 200) return r.text()
      else r.json().then(console.error)
    })
    .then<void | Response>(d => {
      console.log("Hello jsonified")
      if (!d) return
      console.log(d)
      return api.hello()
    })
    .then<void | any>(r => {
      console.log("Hello response")
      if (!r) return
      if (r.status === 200) return r.text()
      else r.json().then(console.error)
    })
    .then<void | Response>(d => {
      console.log("Hello jsonified")
      if (!d) return
      console.log(d)
      return api.logout()
    })
    .then<void | any>(r => {
      console.log("Hello response")
      if (!r) return
      if (r.status === 200) return r.text()
      else r.json().then(console.error)
    }).
    then<void | Response>(d => {
      console.log("Hello jsonified")
      if (!d) return
      console.log(d)
      return api.hello()
    })
    .then<void | any>(r => {
      console.log("Hello response")
      if (!r) return
      if (r.status === 200) return r.text()
      else r.json().then(console.error)
    })
    .then<void | Response>(d => {
      console.log("Hello jsonified")
      if (!d) return
      console.log(d)
      return api.logout()
    })
    .catch(console.error)
}

getAuthenticated()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)