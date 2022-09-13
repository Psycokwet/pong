const PREFIX = 'http://localhost:3000/'
const API = {
  AUTH: `${PREFIX}auth/`
}

async function authUser() {
  const header = new Headers()
  header.append("Content-Type", "application/json")
  const response = await fetch(API.AUTH, {method:"POST", body: JSON.stringify({"username": "john", "password": "changeme"}), headers: header})
  console.log(response.status)
  const data = await response.json()
  console.log(data)
}