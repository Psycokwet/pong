import { FULL_ROUTE } from "../../shared/httpsRoutes/routes";

export const PREFIX =
  import.meta.env.VITE_CONTEXT == "MOCKUP"
    ? "http://localhost:8080/api_mockup"
    : "http://localhost:8080/api";
export enum HeadersFields {
  ContentType = "Content-Type",
  Authorization = "Authorization",
}

export class Api {
  hello() {
    return fetch(`${PREFIX}${FULL_ROUTE.ROOT.ENDPOINT}`, {
      method: "GET",
    });
  }

  logout() {
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.LOGOUT}`, {
      method: "GET",
    });
  }
  setPicture(data: FormData) {
    return fetch(`${PREFIX}${FULL_ROUTE.USER.SET_PICTURE}`, {
      method: "POST",
      body: data,
    });
  }

  getPicture() {
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_PICTURE}`, {
      method: "GET",
    });
  }

  ping() {
    return fetch(`${PREFIX}${URL.PROTECTED}`, {
      method: "GET",
      mode: "no-cors",
      credentials: "include",
    });
  }
  refreshToken() {
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.REFRESH}`, {
      method: "GET",
    });
  }

  add_friend(login42: string, friend_to_add: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.USER.ADD_FRIEND}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ login42, friend_to_add }),
    });
  }

  get_friend_list(login42: string) {
    return fetch(
      `${PREFIX}${FULL_ROUTE.USER.GET_FRIEND_LIST}` +
        "?" +
        new URLSearchParams({ login42 }),
      {
        method: "GET",
        // headers: this._headers,
      }
    );
  }

  get_login42() {
    return fetch(
      `${PREFIX}${FULL_ROUTE.USER.GET_LOGIN42}`,
      {
        method: "GET",
        // headers: this._headers,
      }
    );
  }

  get_nickname(login42: string) {
    return fetch(
      `${PREFIX}${FULL_ROUTE.USER.GET_NICKNAME}` +
        "?" +
        new URLSearchParams({ login42 }),
      {
        method: "GET",
        // headers: this._headers,
      }
    );
  }
  set_nickname(newPongUsername: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.USER.SET_NICKNAME}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ newPongUsername }),
    });
  }
  get_user_rank() {
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_USER_RANK}`, {
      method: "GET",
    });
  }
  get_user_history() {
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_USER_HISTORY}`, {
      method: "GET",
    });
  }
  add_played_game(player1: string, player2: string, winner: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.USER.PLAY_GAME}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ player1, player2, winner }),
    });
  }
}
