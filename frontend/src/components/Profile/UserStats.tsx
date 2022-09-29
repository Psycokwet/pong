import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

type UserStatsProps = {
  nbGames: number;
  nbWins: number;
};

const UserStats: React.FC<UserStatsProps> = ({ nbGames, nbWins }) => {
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  let nbLosts = nbGames - nbWins;
  const dataMock = [
    { title: "Wins", value: nbWins, color: "#158727" },
    { title: "Looses", value: nbLosts, color: "#8B0000" },
  ];
  const data = dataMock.map((entry, i) => {
    if (hovered === i) {
      return {
        ...entry,
        color: "grey",
      };
    }
    return entry;
  });

  return (
    <PieChart
      data={data}
      lineWidth={40}
      startAngle={75}
      paddingAngle={3}
      segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
      segmentsShift={(index) => (index === selected ? 3 : 1)}
      label={({ dataEntry }) => dataEntry.value}
      labelStyle={(index) => ({
        fill: "white",
        fontSize: "5px",
      })}
      labelPosition={112}
      radius={30}
      onClick={(event, index) => {
        console.log("CLICK", { event, index });
        setSelected((c) => (index === c ? undefined : index));
      }}
      onMouseOver={(_, index) => {
        setHovered(index);
      }}
      onMouseOut={() => {
        setHovered(undefined);
      }}
    />
  );
};

export default UserStats;
