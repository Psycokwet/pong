import { useRef } from "react";
import { Message } from "/shared/interfaces/Message";
import { BlockedUserInterface } from "/shared/interfaces/BlockedUserInterface";

const Messages = ({
  messages,
  blockedUserList,
}:{
  messages: Message[];
  blockedUserList: BlockedUserInterface[];
}) => {
  const containerRef = useRef();

  const filteredMessages:Message[] = messages.filter((message) => {
    return blockedUserList.find((blockedUser) => blockedUser.pongUsername==message.author) == undefined
    })
  return (
    <div 
      className="flex flex-col-reverse row-span-5 col-span-3 scroll-smooth overflow-y-auto"
    >
      {filteredMessages.map((message, index) => {
      return (
        <div key={index} className="flex gap-3 py-4 px-10">
          <div className="">
            <h6 className="text-lg font-semibold self-center">
              {message.author}
            </h6>
            <p className="break-all max-w-full whitespace-pre-wrap text-sm">
              {message.content}
            </p>
          </div>
        </div>
      )
    })}
    </div>
  )
}

export default Messages