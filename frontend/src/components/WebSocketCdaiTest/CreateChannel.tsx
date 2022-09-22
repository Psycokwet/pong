import { KeyboardEvent, useState } from "react";
import { Socket } from "socket.io-client";

export default function CreateChannel({
  handleCreateChannel,
}: {
  handleCreateChannel: (newChannelName: string) => void;
}) {
  const [channelName, setChannelName] = useState<string>("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code == "Enter" && channelName !== "")
      handleCreateChannel(channelName);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Channel's name"
        value={channelName}
        onChange={(e) => {
          setChannelName(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      ></input>
      <button onClick={() => handleCreateChannel(channelName)}>
        Create channel
      </button>
    </div>
  );
}
