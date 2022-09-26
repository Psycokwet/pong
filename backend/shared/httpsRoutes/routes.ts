import { generate_full_routes } from '../utils';

export const ROUTES_BASE = {
  USER: {
    ENDPOINT: '/user/',
    SIGNOUT: 'signout',
    SET_PICTURE: 'set_picture',
    GET_PICTURE: 'get_picture',
    ADD_FRIEND: 'add_friend',
    GET_FRIEND_LIST: 'get_friends_list',
    SET_NICKNAME: 'set_pong_username',
    GET_LOGIN42: 'get_login42',
    GET_NICKNAME: 'get_pong_username',
    GET_USER_RANK: 'get_user_rank',
    GET_USER_HISTORY: 'get_user_history',
    PLAY_GAME: 'play_game',
  },
  AUTH: {
    ENDPOINT: '/auth/42/',
    LOGOUT: 'logout',
    REFRESH: 'refresh',
    REDIRECT: 'redirect',
    TURN_ON_2FA: 'turn_on_2fa',
    TURN_OFF_2FA: 'turn_off_2fa',
    GET_2FA: 'get_2fa',
    GENERATE_2FA: 'generate_2fa',
    CHECK_2FA: 'check_2fa',
  },
  ROOT: {
    ENDPOINT: '/',
    PROTECTED: 'protected',
    REFRESH: 'refresh',
    REDIRECT: 'redirect',
  },
};
export const FULL_ROUTE = generate_full_routes(ROUTES_BASE);
