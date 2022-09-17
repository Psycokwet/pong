import { AuthUserDto, AuthUserIdDto } from "./auth-user.dto";

type OnErrorFunction = (reason: any) => void
type OnSuccess = (data? : object) => void

export const PREFIX = import.meta.env.VITE_CONTEXT == "MOCKUP" ? 'http://localhost:8080/api_mockup' : 'http://localhost:8080/api'
export enum URL {
  CREATE_USER = '/user/',
  AUTH = '/auth/',
  HELLO = '/',
  PROTECTED = '/protected'
}
export enum HeadersFields {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
}

export type Bearer = {
  access_token: string
}

export class Api {
  private static readonly header = new Headers()

  static {
    Api.header.append(HeadersFields.ContentType, "application/json")
  }

  private readonly _headers = new Headers()

  constructor() {
    this._headers.append(HeadersFields.ContentType, "application/json")
  }

  setToken(token: string) {
    this._headers.set(HeadersFields.Authorization, `Bearer ${token}`)
  }

  private static async fetch(url: string, data: object): Promise<any> {
    return fetch(url, {method: 'POST', body: JSON.stringify(data), headers: this.header})
  }

  private static fetchNoResponseBody(url: string, data: object, onSuccess: OnSuccess, onError: OnErrorFunction) {
    const myVar = fetch(url, {method: 'POST', body: JSON.stringify(data), headers: this.header})
      .then(r => {
        if (r.status !== 201) {
          r.json().then(d => {
            throw d;
          })
          return
        }
        onSuccess()
      })
      .catch(onError)
  }

  static async auth(username: string, password: string): Promise<Response> {
    const authUserDto: AuthUserDto = {
      username: username,
      password: password,
    }
    return this.fetch(`${PREFIX}${URL.AUTH}`, authUserDto)
  }

  static createUser(username: string, password: string, email: string) {
    const AuthUserIdDto : AuthUserIdDto = {
      username: username,
      password: password,
      email: email,
    }
    this.fetchNoResponseBody(`${PREFIX}${URL.CREATE_USER}`, AuthUserIdDto, () => console.log("user created"), console.error)
  }

  hello() {
    return fetch(`${PREFIX}${URL.HELLO}`, {method: 'GET', headers: this._headers})
  }

  logout() {
    return fetch(`${PREFIX}${URL.AUTH}`, {method: 'DELETE', headers: this._headers})
  }

  ping() {
    return fetch(`${PREFIX}${URL.PROTECTED}`, {method: 'GET', mode:'no-cors', credentials:'include'})
  }
}


