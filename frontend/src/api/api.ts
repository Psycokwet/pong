import { FULL_ROUTE } from "../../shared/httpsRoutes/routes";

export const PREFIX =
  import.meta.env.VITE_CONTEXT == "MOCKUP"
    ? import.meta.env.VITE_PONG_URL_BACK_MOCKUP
    : import.meta.env.VITE_PONG_URL_BACK;
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
  getPicture(pongUsername: string | null) {
    if (pongUsername)
      return fetch(
        `${PREFIX}${FULL_ROUTE.USER.GET_PICTURE}` +
          "\\?" +
          new URLSearchParams({ pongUsername }),
        {
          method: "GET",
        }
      );
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_PICTURE}`, {
      method: "GET",
    });
  }

  ping() {
    return fetch(`${PREFIX}${FULL_ROUTE.ROOT.PROTECTED}`, {
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

  get_login42() {
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_LOGIN42}`, {
      method: "GET",
      // headers: this._headers,
    });
  }

  get_pong_username() {
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_PONG_USERNAME}`, {
      method: "GET",
      // headers: this._headers,
    });
  }
  set_pong_username(newPongUsername: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.USER.SET_PONG_USERNAME}`, {
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
  check_2fa(code: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.CHECK_2FA}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ code }),
    });
  }
  turn_on_2fa(code: string) {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.TURN_ON_2FA}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ code }),
    });
  }
  turn_off_2fa() {
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.TURN_OFF_2FA}`, {
      method: "PUT",
    });
  }
  get_2fa() {
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.GET_2FA}`, {
      method: "GET",
    });
  }
  generate_2fa() {
    let headers = new Headers();
    headers.set(HeadersFields.ContentType, "application/json");
    return fetch(`${PREFIX}${FULL_ROUTE.AUTH.GENERATE_2FA}`, {
      method: "POST",
      headers: headers,
    });
  }
  get_user_profile(pongUsername: string | undefined) {
    if (pongUsername != undefined) {
      return fetch(
        `${PREFIX}${FULL_ROUTE.USER.GET_USER_PROFILE}?${new URLSearchParams({
          pongUsername,
        }).toString()}`,
        {
          method: "GET",
        }
      );
    }
    return fetch(`${PREFIX}${FULL_ROUTE.USER.GET_USER_PROFILE}`, {
      method: "GET",
    });
  }
}
