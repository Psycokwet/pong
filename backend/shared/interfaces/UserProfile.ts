export default interface UserProfile {
  pongUsername: string;
  userRank: { level: number; userRank: { rank: number } };
  userHistory: {
    nbGames: number;
    nbWins: number;
    games: {
      time: string;
      opponent: string;
      winner: string;
      id: number;
    }[];
  };
}
