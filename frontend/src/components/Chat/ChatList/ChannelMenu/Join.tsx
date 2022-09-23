import { useState } from "react";

function Join ()  {
  const [joinName, setJoinName] = useState<string>("");
  const [joinPass, setJoinPass] = useState<string>("");
  let channelList = [{name:"SUS"}, {name:"seconD"}, {name:"and the third long"}]
  return (
          <div className="text-base font-light">
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Serveur Name"
              value={joinName}
              onChange={(e) => {
                setJoinName(e.target.value);
              }}
            ></input>
            <p>Or</p>
            <select className="bg-slate-600">
              <option value="" disabled selected hidden>Select Public Channel</option>
              {channelList.map((Chan, i) => {return <option key={i}>{Chan.name}</option>})}
            </select>
            <input
              className="bg-slate-600"
              type="text"
              placeholder="Password (optionnal)"
              value={joinPass}
              onChange={(e) => {
                setJoinPass(e.target.value);
              }}
            ></input>
          </div>
  );
}

export default Join
