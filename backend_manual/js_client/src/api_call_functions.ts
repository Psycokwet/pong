
import { Api, Bearer } from "./api/api";

export async function createUser() {
  let api: Api = new Api()
  return await Api.createUser("forgeronvirtuel", "fdfg453GFHFgfh", "socarboni@gmail.com")
}

export async function getAuthenticated() {
  let api: Api = new Api()
  Api.auth("forgeronvirtuel", "fdfg453GFHFgfh")
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
