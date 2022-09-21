import ChannelData from "../../../shared/interface/ChannelData";

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