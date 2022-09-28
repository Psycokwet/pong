import { StreamableFile } from '@nestjs/common';

export default interface UserProfile {
  pongUsername: string;
  userRank: { level: number; userRank: number };
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
  profilePicture: StreamableFile | null;
}
