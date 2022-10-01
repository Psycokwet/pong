import { Socket } from "socket.io-client";
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";
import { KeyboardEvent, useState, useEffect } from 'react';
import { ChangeChannelData } from "/shared/interfaces/ChangeChannelData";
import { Privileges } from '/shared/interfaces/UserPrivilegesEnum';

const Channel = function ({channel, socket, connectedChannel}:{
  channel:ChannelData,
  socket:Socket|undefined,
  connectedChannel:ChannelData|undefined,
}){
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [newChanPassword, setNewChanPassword] = useState<string>('');

  useEffect(() => {
    if (connectedChannel?.channelId !== channel.channelId)
      setIsVisible(false);
  }, [connectedChannel]);
  const handleClick = () => {
    if (connectedChannel?.channelId !== channel.channelId)
      socket?.emit(ROUTES_BASE.CHAT.JOIN_CHANNEL_REQUEST, {roomId: channel.channelId});
    else setIsVisible(val => !val);
  }
  const handleKeyDownPassword = (e: KeyboardEvent) => {
    if (e.code == 'Enter')
      handleClick();
  }
  const changePassword = () => {
    socket?.emit(ROUTES_BASE.CHAT.CHANGE_PASSWORD_REQUEST, {
      channelName: channel.channelName,
      inputPassword:newChanPassword
    } as ChangeChannelData);
    setNewChanPassword('');
    setIsVisible(false);
  }
  return (
    <div
      className={("max-w-full truncate text-lg font-semibold self-center py-4 px-10 hover:bg-slate-800 cursor-pointer overflow-visible" + ((connectedChannel !== undefined && connectedChannel.channelId === channel.channelId) ? ' bg-slate-600':''))}
      onClick={handleClick}>
      <p>{channel.channelName}</p>
      {isVisible && connectedChannel.currentUserPrivileges === Privileges.OWNER ?
        <div className="flex flex-col gap-2">
          <input
            className="bg-slate-600"
            type="text"
            autoFocus={true}
            placeholder="Change password"
            value={newChanPassword}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setNewChanPassword(e.target.value)}
            onKeyDown={handleKeyDownPassword}
          ></input>
          <button onClick={changePassword}>Validate</button>
        </div>
        : <></>
      }
    </div>
  )
};

export default Channel
