import GameData from "./GameData";

export default interface GameRoom {
  roomName: string;
  started: boolean;
  isChallenge: boolean;
  gameData: GameData;
  spectatorsId: number[];
}