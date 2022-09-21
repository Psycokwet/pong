import { FULL_ROUTE } from "../../shared/routes";

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
}
