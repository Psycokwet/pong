export const ROUTES_BASE = {
  CHAT: {
    ENDPOINT: '/chat/',
    /** LOBBY */
    JOIN_CHANNEL_LOBBY_REQUEST: 'joinChannelLobbyRequest',
    LIST_ALL_CHANNELS: 'listAllChannels',
    NEW_CHANNEL_CREATED: 'newChannelCreated',
    /** ATTACHED CHANNELS LOBBY */
    JOIN_ATTACHED_CHANNEL_LOBBY_REQUEST: 'joinAttachedChannelLobbyRequest',
    LIST_ALL_ATTACHED_CHANNELS: 'listAllAttachedChannels',
    /** DM CHANNELS LOBBY */
    JOIN_DM_CHANNEL_LOBBY_REQUEST: 'joinDMChannelLobbyRequest',
    LIST_ALL_DM_CHANNELS: 'listAllDMChannels',
    /** CREATE CHANNEL */
    CREATE_CHANNEL_REQUEST: 'createChannelRequest',
    CONFIRM_CHANNEL_CREATION: 'confirmChannelCreation',
    /** CREATE DM CHANNEL */
    CREATE_DM: 'createDMRequest',
    CONFIRM_DM_CHANNEL_CREATION: 'confirmDMChannelCreation',
    /** JOIN CHANNEL */
    JOIN_CHANNEL_REQUEST: 'joinChannelRequest',
    CONFIRM_CHANNEL_ENTRY: 'confirmChannelEntry',
    /** JOIN ATTACHED CHANNELS LOBBY */
    /** JOIN DM CHANNELS LOBBY */
    /** DISCONNECT FROM CHANNEL */
    DISCONNECT_FROM_CHANNEL_REQUEST: 'disconnectFromChannelRequest',
    CONFIRM_CHANNEL_DISCONNECTION: 'confirmChannelDisconnection',
    /** SEND MESSAGE */
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
    /** MESSAGE HISTORY */
    MESSAGE_HISTORY: 'messageHistory',
    /** GET CONNECTED USER LIST */
    GET_CONNECTED_USER_LIST_REQUEST: 'getConnectedUserListRequest',
    CONNECTED_USER_LIST: 'connectedUserList',
    UPDATE_CONNECTED_USERS: 'updateConnectedUsers',
    /** CHANNEL ATTACHED USER LIST */
    UPDATE_CHANNEL_ATTACHED_USER_LIST: 'updateChannelAttachedUserList',
    /** ATTACH TO CHANNEL REQUEST */
    ATTACH_TO_CHANNEL_REQUEST: 'attachToChannelRequest',
    /** UNATTACH TO CHANNEL REQUEST */
    UNATTACH_TO_CHANNEL_REQUEST: 'unattachToChannelRequest',
  },
  GAME: {
    ENDPOINT: '/game/',
    /** JOIN GAME LOBBY REQUEST */
    JOIN_GAME_LOBBY_REQUEST: 'joinGameLobbyRequest',
    /** CREATE GAME */
    CREATE_GAME_REQUEST: 'createGameRequest',
    // CONFIRM_GAME_CREATION: 'confirmGameCreation',
    /** JOIN GAME */
    JOIN_GAME_REQUEST: 'joinGameRequest',
    CONFIRM_GAME_JOINED: 'confirmGameJoined',
    /** SEND INPUT */
    SEND_INPUT: 'sendInput',
    /** GAME LOOP */
    UPDATE_GAME: 'updateGame',
    /** GET SPECTABLE GAME */
    GET_SPECTABLE_GAMES_REQUEST: 'getSpectableGamesRequest',
    UPDATE_SPECTABLE_GAMES: 'updateSpectableGames',
    JOIN_SPECTATE_REQUEST: 'joinSpectateRequest',
  },
  USER: {
    ERROR: 'error',
  }
};
const generate_full_routes = (routes_base) => {
  let accumulator = {};
  for (const key_base_route in routes_base) {
    let { ENDPOINT, ...current_sub_routes } = routes_base[key_base_route];
    accumulator[key_base_route] = { ENDPOINT };
    for (const key_end_route in current_sub_routes) {
      accumulator[key_base_route][key_end_route] =
        ENDPOINT + current_sub_routes[key_end_route];
    }
  }
  return accumulator;
};
export const FULL_ROUTE = generate_full_routes(ROUTES_BASE);
