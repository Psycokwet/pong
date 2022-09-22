import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";

export default function CreateChannel({
  handleCreatePrivateChannel,
  handleCreatePublicChannel,
} : {
  handleCreatePrivateChannel: ({newChannelName, newChannelPass} : {newChannelName: string, newChannelPass: string}) => void,  
  handleCreatePublicChannel: ({newChannelName, newChannelPass} : {newChannelName: string, newChannelPass: string}) => void 
})
{
  const [channelName, setChannelName] = useState<string>("");
  const [channelPass, setChannelPass] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'Enter') {
			handleCreatePublicChannel({newChannelName:channelName, newChannelPass:channelPass})
			setChannelName("")
			setChannelPass("")
		}
  }
  const handleClickPublic = () => {
		handleCreatePublicChannel({newChannelName:channelName, newChannelPass:channelPass})
		setChannelName("")
		setChannelPass("")
  }
  const handleClickPrivate = () => {
		handleCreatePrivateChannel({newChannelName:channelName, newChannelPass:channelPass})
		setChannelName("")
		setChannelPass("")
  }

  return (
    <div className="flex">
      <input
        type="text"
        placeholder="Channel's name"
        value={channelName}
        onChange={(e) => {
          setChannelName(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      <input
        type="text"
        placeholder="password"
        value={channelPass}
        onChange={(e) => {
          setChannelPass(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      <button onClick={handleClickPublic}>Create public</button>
      <button onClick={handleClickPrivate}>Create private</button>
    </div>
  );
}
