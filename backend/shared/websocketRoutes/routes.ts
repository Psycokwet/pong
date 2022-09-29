import { generate_full_routes } from '../utils';

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
    /** GET ATTACHED USERS IN CHANNEL */
    ATTACHED_USERS_LIST_REQUEST: 'attachedUsersListRequest',
    ATTACHED_USERS_LIST_CONFIRMATION: 'attachedUsersListConfirmation',
    /** SEND MESSAGE */
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
    /** MESSAGE HISTORY */
    MESSAGE_HISTORY: 'messageHistory',
    /** CHANNEL ATTACHED USER LIST */
    UPDATE_CHANNEL_ATTACHED_USER_LIST: 'updateChannelAttachedUserList',
    ATTACHED_USER_LIST_SENT: 'attachedUserListSent',
    /** ATTACH TO CHANNEL REQUEST */
    ATTACH_TO_CHANNEL_REQUEST: 'attachToChannelRequest',
    /** SET / UNSET ADMIN */
    SET_ADMIN_REQUEST: 'setAdminRequest',
    UNSET_ADMIN_REQUEST: 'unsetAdminRequest',
    SET_ADMIN_CONFIRMATION: 'setAdminConfirmation',
    UNSET_ADMIN_CONFIRMATION: 'unsetAdminConfirmation',
    /** UNATTACH TO CHANNEL REQUEST */
    UNATTACH_TO_CHANNEL_REQUEST: 'unattachToChannelRequest',
    /** USER PRIVILEGES */
    USER_PRIVILEGES_REQUEST: 'userPrivilegesRequest',
    USER_PRIVILEGES_CONFIRMATION: 'userPrivilegesConfirmation',
    /** BAN USER REQUEST */
    BAN_USER_REQUEST: 'banUserRequest',
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
    /** GAMEOVER CONFIRM */
    GAMEOVER_CONFIRM: 'gameoverConfirm',
    /** GET SPECTABLE GAME */
    GET_SPECTABLE_GAMES_REQUEST: 'getSpectableGamesRequest',
    UPDATE_SPECTABLE_GAMES: 'updateSpectableGames',
    JOIN_SPECTATE_REQUEST: 'joinSpectateRequest',
    /** SET CANVAS SIZE */
    SET_CANVAS_SIZE: 'setCanvasSize',
  },
  USER: {
    ERROR: 'error',
    /** ADD FRIEND */
    ADD_FRIEND_REQUEST: 'addFriendRequest',
    ADD_FRIEND_CONFIRMATION: 'addFriendConfirmation',
    /** FRIENDS LIST */
    FRIEND_LIST_REQUEST: 'friendListRequest',
    FRIEND_LIST_CONFIRMATION: 'friendListConfirmation',
    /** GET STATUS */
    GET_STATUS_REQUEST: 'getStatusRequest',
    GET_STATUS_CONFIRMATION: 'getStatusConfirmation',
    /** CONNECTION NOTIFICATION */
    CONNECTION_CHANGE: 'connectionChange',
  },
};
export const FULL_ROUTE = generate_full_routes(ROUTES_BASE);
