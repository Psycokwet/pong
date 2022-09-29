import React from "react";

type UserMatchHistoryProps = {
  userHistory: {
    time: string;
    opponent: string;
    winner: string;
    id: Number;
  }[];
};

const UserMatchHistory: React.FC<UserMatchHistoryProps> = ({ userHistory }) => {
  return <div> UserMatchHistory {userHistory[0].winner}</div>;
};

export default UserMatchHistory;
