import GameData from "./GameData";

export default interface GameRoom {
  roomName: string;
  started: boolean;
  gameData: GameData;
  spectatorsId: number[];
}