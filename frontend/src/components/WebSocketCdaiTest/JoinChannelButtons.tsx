import ChannelData from "../../../shared/interface/ChannelData";

export default function JoinChannelButtons(
  {
    allChannel,
    handleClick,
  }:
  {
    allChannel: ChannelData[],
    handleClick: any,
  }
  ) {

  return (
    <div> 
      {
        allChannel.map(
          (channel) =>
            <div key={channel.channelId} >
              <button onClick={() => handleClick(channel.channelId)}>Join {channel.channelName}/id: {channel.channelId}</button>
            </div>
        )
      }
    </div>
  )
}