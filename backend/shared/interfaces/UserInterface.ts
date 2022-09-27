export enum Status {
  OFFLINE,
  PLAYING,
  ONLINE,
}

export interface UserInterface {
  id: number;
  pongUsername: string;
  status: Status;
}
