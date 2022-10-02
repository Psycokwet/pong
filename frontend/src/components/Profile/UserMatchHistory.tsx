import React from "react";

const MAX_SHOWN_GAME = 4;

type UserMatchHistoryProps = {
  userHistory: {
    time: string;
    opponent: string;
    winner: string;
    id: Number;
  }[];
};

const UserMatchHistory: React.FC<UserMatchHistoryProps> = ({ userHistory }) => {
  return (
    <table className="table-auto border-separate border-spacing-2">
      <thead>
        <tr>
          <th>Time</th>
          <th>Opponent</th>
          <th>Winner</th>
        </tr>
      </thead>
      <tbody>
        {userHistory.map((oneGame, id) => {
          while (id <= MAX_SHOWN_GAME)
            return (
              <tr key={id}>
                <td>{oneGame.time}</td>
                <td>{oneGame.opponent}</td>
                <td>{oneGame.winner}</td>
              </tr>
            );
        })}
      </tbody>
    </table>
  );
};

export default UserMatchHistory;
