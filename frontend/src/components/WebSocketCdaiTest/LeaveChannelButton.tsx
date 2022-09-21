import { Socket } from "socket.io-client";
interface ChannelData {
  channelName: string;
  channelId: number;
}

export default function LeaveChannelButton(
  {
    channelName,
    sendDisconnect,
  }:
  {
    channelName: string,
    sendDisconnect: () => void,
  }
  ) {

  return (
    <div>
      <button onClick={sendDisconnect}>Disconnect to the channel {channelName}</button>
    </div>
  )
}