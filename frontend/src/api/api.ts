import { AuthUserDto } from "./auth-user.dto";

type OnErrorFunction = (reason: any) => void
type OnSuccess = (data? : object) => void

export const PREFIX = import.meta.env.VITE_CONTEXT == "MOCKUP" ? 'http://localhost:8080/api_mockup' : 'http://localhost:8080/api'
export enum URL {
  HELLO = '/',
  SIGNUP = '/user/signup',
  SIGNIN = '/user/signin',
  SIGNOUT = '/user/signout',
  SET_PICTURE = '/user/set_picture',
  GET_PICTURE = '/user/get_picture',
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

  constructor() {}

  setToken(token: string) {
    this._headers.set(HeadersFields.Authorization, `Bearer ${token}`)
  }

  private static async fetch(url: string, data: any): Promise<any> {
    return fetch(url, {method: 'POST', body: data, headers: this.header})
  }

  private static fetchNoResponseBody(url: string, data: object, onSuccess: OnSuccess, onError: OnErrorFunction) {
    fetch(url, {method: 'POST', body: JSON.stringify(data), headers: this.header})
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
    return this.fetch(`${PREFIX}${URL.SIGNIN}`, authUserDto)
  }

  static createUser(username: string, password: string, email: string) {
    const createUserDto : AuthUserDto = {
      username: username,
      password: password,
    }
    this.fetchNoResponseBody(`${PREFIX}${URL.SIGNUP}`, createUserDto, () => console.log("user created"), console.error)
  }

  hello() {
    return fetch(`${PREFIX}${URL.HELLO}`, {method: 'GET', headers: this._headers})
  }

  logout() {
    return fetch(`${PREFIX}${URL.SIGNOUT}`, {method: 'POST', headers: this._headers})
  }

  setPicture(data: FormData) {
    return fetch(`${PREFIX}${URL.SET_PICTURE}`, {method: 'POST', headers: this._headers, body: data})
  }

  getPicture() {
    return fetch(`${PREFIX}${URL.GET_PICTURE}`, {method: 'GET', headers: this._headers})
  }
}

