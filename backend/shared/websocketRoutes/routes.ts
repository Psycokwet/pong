import { generate_full_routes } from "../utils";

export const ROUTES_BASE: { [key: string]: { [key: string]: string } } = {
  CHAT: {
    ENDPOINT: "/chat/",
    /** LOBBY */
    JOIN_CHANNEL_LOBBY_REQUEST: "joinChannelLobbyRequest",
    LIST_ALL_CHANNELS: "listAllChannels",
    NEW_CHANNEL_CREATED: "newChannelCreated",
    /** ATTACHED CHANNELS LOBBY */
    JOIN_ATTACHED_CHANNEL_LOBBY_REQUEST: "joinAttachedChannelLobbyRequest",
    LIST_ALL_ATTACHED_CHANNELS: "listAllAttachedChannels",
    /** DM CHANNELS LOBBY */
    JOIN_DM_CHANNEL_LOBBY_REQUEST: "joinDMChannelLobbyRequest",
    LIST_ALL_DM_CHANNELS: "listAllDMChannels",
    /** CREATE CHANNEL */
    CREATE_CHANNEL_REQUEST: "createChannelRequest",
    CONFIRM_CHANNEL_CREATION: "confirmChannelCreation",
    /** CREATE DM CHANNEL */
    CREATE_DM: "createDMRequest",
    CONFIRM_DM_CHANNEL_CREATION: "confirmDMChannelCreation",
    /** JOIN CHANNEL */
    JOIN_CHANNEL_REQUEST: "joinChannelRequest",
    CONFIRM_CHANNEL_ENTRY: "confirmChannelEntry",
    /** JOIN ATTACHED CHANNELS LOBBY */
    /** JOIN DM CHANNELS LOBBY */
    /** DISCONNECT FROM CHANNEL */
    DISCONNECT_FROM_CHANNEL_REQUEST: "disconnectFromChannelRequest",
    CONFIRM_CHANNEL_DISCONNECTION: "confirmChannelDisconnection",
    /** GET ATTACHED USERS IN CHANNEL */
    ATTACHED_USERS_LIST_REQUEST: "attachedUsersListRequest",
    ATTACHED_USERS_LIST_CONFIRMATION: "attachedUsersListConfirmation",
    /** SEND MESSAGE */
    SEND_MESSAGE: "sendMessage",
    RECEIVE_MESSAGE: "receiveMessage",
    /** MESSAGE HISTORY */
    MESSAGE_HISTORY: "messageHistory",
    /** ATTACH TO CHANNEL REQUEST */
    ATTACH_TO_CHANNEL_REQUEST: "attachToChannelRequest",
    /** SET / UNSET ADMIN */
    SET_ADMIN_REQUEST: "setAdminRequest",
    UNSET_ADMIN_REQUEST: "unsetAdminRequest",
    SET_ADMIN_CONFIRMATION: "setAdminConfirmation",
    UNSET_ADMIN_CONFIRMATION: "unsetAdminConfirmation",
    /** UNATTACH TO CHANNEL REQUEST */
    UNATTACH_TO_CHANNEL_REQUEST: "unattachToChannelRequest",
    UNATTACH_TO_CHANNEL_CONFIRMATION: "unattachToChannelConfirmation",
    /** USER PRIVILEGES */
    USER_PRIVILEGES_REQUEST: "userPrivilegesRequest",
    USER_PRIVILEGES_CONFIRMATION: "userPrivilegesConfirmation",
    /** BAN USER REQUEST */
    BAN_USER_REQUEST: "banUserRequest",
    GET_BANNED: "getBanned",
    /** MUTE USER REQUEST */
    MUTE_USER_REQUEST: "muteUserRequest",
    /** CHANGE PASSWORD */
    CHANGE_PASSWORD_REQUEST: "changePasswordRequest",
    CHANGE_PASSWORD_CONFIRMATION: "changePasswordConfirmation",
  },
  GAME: {
    ENDPOINT: "/game/",
    /** JOIN GAME LOBBY REQUEST */
    JOIN_GAME_LOBBY_REQUEST: "joinGameLobbyRequest",
    /** CREATE GAME */
    CREATE_GAME_REQUEST: "createGameRequest",
    /** CREATE CHALLENGE */
    CREATE_CHALLENGE_REQUEST: "createChallengeRequest",
    NOTIF_CHALLENGE_CONFIRM: "notifChallengeConfirm",
    CHALLENGE_LIST_REQUEST: "challengeListRequest",
    CHALLENGE_LIST_CONFIRM: "challengeListConfirm",
    CHALLENGE_ACCEPT_REQUEST: "challengeAcceptRequest",
    /** JOIN GAME */
    JOIN_GAME_REQUEST: "joinGameRequest",
    /** SEND INPUT */
    SEND_INPUT: "sendInput",
    /** GAME LOOP */
    UPDATE_GAME: "updateGame",
    /** GAMEOVER CONFIRM */
    GAMEOVER_CONFIRM: "gameoverConfirm",
    /** SPECTABLE GAME */
    GET_SPECTABLE_GAMES_REQUEST: "getSpectableGamesRequest",
    UPDATE_SPECTABLE_GAMES: "updateSpectableGames",
    JOIN_SPECTATE_REQUEST: "joinSpectateRequest",
    /** RECONNECT GAME */
    RECONNECT_GAME_REQUEST: "reconnectGameRequest",
    /** CANCEL MATCH MAKING */
    CANCEL_MATCH_MAKING_REQUEST: "cancelMatchMakingRequest",
  },
  USER: {
    ERROR: "error",
    /** ADD FRIEND */
    ADD_FRIEND_REQUEST: "addFriendRequest",
    ADD_FRIEND_CONFIRMATION: "addFriendConfirmation",
    /** FRIENDS LIST */
    FRIEND_LIST_REQUEST: "friendListRequest",
    FRIEND_LIST_CONFIRMATION: "friendListConfirmation",
    /** GET STATUS */
    GET_STATUS_REQUEST: "getStatusRequest",
    GET_STATUS_CONFIRMATION: "getStatusConfirmation",
    /** CONNECTION NOTIFICATION */
    CONNECTION_CHANGE: "connectionChange",
    /** BLOCK USER */
    BLOCK_USER_REQUEST: "blockUserRequest",
    BLOCK_USER_CONFIRMATION: "blockUserConfirmation",
    /** BLOCKED USERS LIST */
    BLOCKED_USERS_LIST_REQUEST: "blockedUsersListRequest",
    BLOCKED_USERS_LIST_CONFIRMATION: "blockedUsersListConfirmation",
  },
  ERROR: { ENDPOINT: "error" },
} as const;
export const FULL_ROUTE = generate_full_routes(ROUTES_BASE);
