import Position from "./Position";

export default interface Player {
  userId: number;
  pongUsername: string;
  score: number;
  y: number;
}