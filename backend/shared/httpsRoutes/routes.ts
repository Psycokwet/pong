import { generate_full_routes } from '../utils';

export const ROUTES_BASE = {
  USER: {
    ENDPOINT: '/user/',
    SET_PICTURE: 'set_picture',
    GET_PICTURE: 'get_picture',
    GET_LOGIN42: 'get_login42',
    SET_PONG_USERNAME: 'set_pong_username',
    GET_PONG_USERNAME: 'get_pong_username',
    GET_USER_RANK: 'get_user_rank',
    GET_USER_HISTORY: 'get_user_history',
    GET_USER_PROFILE: 'get_user_profile',
    GET_GAME_COLORS: 'get_game_colors',
    SET_GAME_COLORS: 'set_game_colors',
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
    FALSE_42_LOGIN: 'false42Login',
  },
  ROOT: {
    ENDPOINT: '/',
    PROTECTED: 'protected',
  },
};
export const FULL_ROUTE = generate_full_routes(ROUTES_BASE);
