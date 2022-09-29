import React from "react";

type UserMatchHistoryProps = {
  userHistory: {
    nbGames: number;
    nbWins: number;
    games: string[];
  };
};

const UserMatchHistory: React.FC<UserMatchHistoryProps> = ({ userHistory }) => {
  return (
  <div>
    UserMatchHistory {userHistory.nbGames}
    UserMatchHistory {userHistory.nbWins}
    UserMatchHistory {userHistory.games[0]}
    </div>);
};

export default UserMatchHistory;
