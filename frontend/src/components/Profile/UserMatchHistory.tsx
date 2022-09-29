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
  return(<>
  {userHistory.map((oneGame, id) => { 
    return(
      <> 
        <div>{id}</div>
        <div>{oneGame.time}</div>
        <div>{oneGame.opponent}</div>
        <div>{oneGame.winner}</div>
      </>
    )
  })}
  </>)  
};

export default UserMatchHistory;
