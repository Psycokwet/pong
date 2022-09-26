import Ball from "./Ball"
import Player from "./Player"

export default interface GameData {
    player1: Player;
    player2: Player;
    ball: Ball;
}