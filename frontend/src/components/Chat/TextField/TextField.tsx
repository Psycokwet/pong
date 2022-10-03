import { Socket } from "socket.io-client";
import { useState } from "react";
import { IoSend } from "react-icons/io5"
import { ROUTES_BASE } from "/shared/websocketRoutes/routes";
import { ChannelData } from "/shared/interfaces/ChannelData";

function TextField ({socket , connectedChannel}:{
    socket:Socket|undefined,
    connectedChannel:ChannelData,
}){
  const [message, setValue] = useState<string>('')

  const sendMessage = () => {
    socket?.emit(ROUTES_BASE.CHAT.SEND_MESSAGE, {
      channelId: connectedChannel?.channelId,
      message,
    });
    setValue('');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="px-12 row-span-1 row-start-9 col-span-3 col-start-2 overflow-hidden">
      <div className="flex bg-slate-700 w-5/6 rounded-lg">
        <textarea
          placeholder="Type your message..."
          autoFocus={true}
          rows={3}
          value={message}
          className="w-full bg-slate-700 resize-none"
          id="chat"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IoSend
          size="40"
          onClick={sendMessage}
          className="cursor-pointer"
          />
      </div>
    </div>
  )
}

export default TextField