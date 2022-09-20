import { AuthUserDto, AuthUserIdDto } from "./auth-user.dto";

type OnErrorFunction = (reason: any) => void;
type OnSuccess = (data?: object) => void;

export const PREFIX =
  import.meta.env.VITE_CONTEXT == "MOCKUP"
    ? "http://localhost:8080/api_mockup"
    : "http://localhost:8080/api";
export enum URL {
  CREATE_USER = "/user/",
  AUTH = "/auth/42/",
  LOGOUT = "/auth/42/logout",
  HELLO = "/",
  PROTECTED = "/protected",
  REFRESH_TOKEN = "/auth/refresh",
  SIGNOUT = "/user/signout",
  SET_PICTURE = "/user/set_picture",
  GET_PICTURE = "/user/get_picture",
  ADD_FRIEND = "/user/add_friend",
  GET_FRIEND_LIST = "/user/get_friends_list",
  SET_NICKNAME = "/user/set_pongUsername",
  GET_NICKNAME = "/user/get_pongUsername",
}
export enum HeadersFields {
  ContentType = "Content-Type",
  Authorization = "Authorization",
}

export type Bearer = {
  access_token: string;
};

export class Api {
  // private static readonly header = new Headers();

  // static {
  //   Api.header.append(HeadersFields.ContentType, "application/json");
  // }

  private readonly _headers = new Headers();

  // constructor() {}

  // setToken(token: string) {
  //   this._headers.set(HeadersFields.Authorization, `Bearer ${token}`);
  // }

  // private static async fetch(url: string, data: any): Promise<any> {
  //   return fetch(url, { method: "POST", body: data, headers: this.header });
  // }

  // private static fetchNoResponseBody(
  //   url: string,
  //   data: object,
  //   onSuccess: OnSuccess,
  //   onError: OnErrorFunction
  // ) {
  //   const myVar = fetch(url, {
  //     method: "POST",
  //     body: JSON.stringify(data),
  //     headers: this.header,
  //   })
  //     .then((r) => {
  //       if (r.status !== 201) {
  //         r.json().then((d) => {
  //           throw d;
  //         });
  //         return;
  //       }
  //       onSuccess();
  //     })
  //     .catch(onError);
  // }

  hello() {
    return fetch(`${PREFIX}${URL.HELLO}`, {
      method: "GET",
      // headers: this._headers,
    });
  }

  logout() {
    return fetch(`${PREFIX}${URL.LOGOUT}`, {
      method: "GET",
      // headers: this._headers,
    });
  }
  //cors not the way to go
  // login() {
  //   return fetch(`${PREFIX}${URL.AUTH}`, { method: 'GET', headers: this._headers })
  // }

  setPicture(data: FormData) {
    return fetch(`${PREFIX}${URL.SET_PICTURE}`, { method: "POST", body: data });
  }

  getPicture() {
    return fetch(`${PREFIX}${URL.GET_PICTURE}`, {
      method: "GET",
      // headers: this._headers,
    });
  }

  refreshToken() {
    return fetch(`${PREFIX}${URL.REFRESH_TOKEN}`, {
      method: "GET",
      // headers: this._headers,
    });
  }
  add_friend(login42: string, friend_to_add: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${URL.ADD_FRIEND}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ login42, friend_to_add }),
    });
  }

  get_friend_list(login42: string) {
    return fetch(
      `${PREFIX}${URL.GET_FRIEND_LIST}` +
        "?" +
        new URLSearchParams({ login42 }),
      {
        method: "GET",
        // headers: this._headers,
      }
    );
  }

  get_nickname(login42: string) {
    return fetch(
      `${PREFIX}${URL.GET_NICKNAME}` + "?" + new URLSearchParams({ login42 }),
      {
        method: "GET",
        headers: this._headers,
      }
    );
  }
  set_nickname(login42: string, new_pongUsername: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${URL.SET_NICKNAME}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ login42, new_pongUsername }),
    });
  }
}
