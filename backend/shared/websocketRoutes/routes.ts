export const ROUTES_BASE = {
  CHAT: {
    ENDPOINT: '/chat/',
    /** LOBBY */
    JOIN_CHANNEL_LOBBY_REQUEST: 'joinChannelLobbyRequest',
    LIST_ALL_CHANNELS: 'listAllChannels',
    NEW_CHANNEL_CREATED: 'newChannelCreated',
    /** CREATE CHANNEL */
    CREATE_CHANNEL_REQUEST: 'createChannelRequest',
    CONFIRM_CHANNEL_CREATION: 'confirmChannelCreation',
    /** JOIN CHANNEL */
    JOIN_CHANNEL_REQUEST: 'joinChannelRequest',
    CONFIRM_CHANNEL_ENTRY: 'confirmChannelEntry',
    /** DISCONNECT FROM CHANNEL */
    DISCONNECT_FROM_CHANNEL_REQUEST: 'disconnectFromChannelRequest',
    CONFIRM_CHANNEL_DISCONNECTION: 'confirmChannelDisconnection',
    /** SEND MESSAGE */
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
    /** GET CONNECTED USER LIST */
    GET_CONNECTED_USER_LIST_REQUEST: 'getConnectedUserListRequest',
    CONNECTED_USER_LIST: 'connectedUserList',
    UPDATE_CONNECTED_USERS: 'updateConnectedUsers',
    /** SEARCH CHANNEL */
    SEARCH_CHANNEL_REQUEST: 'searchChannelRequest',
    /** CHANNEL ATTACHED USER LIST */
    UPDATE_CHANNEL_ATTACHED_USER_LIST: 'updateChannelAttachedUserList',
  },
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
