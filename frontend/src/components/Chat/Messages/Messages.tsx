import { useRef } from "react";
import UserPicture from "../../UserPicture/UserPicture";
import { Message } from "/shared/interfaces/Message";
import { UserInterface } from "/shared/interfaces/UserInterface";

const Messages = ({messages}: {messages:Message[]}) => {
  const containerRef = useRef();

  return (
    <div 
      className="flex flex-col-reverse row-span-5 col-span-3 scroll-smooth overflow-y-auto"
    >
      {messages.map((message, index) => {
      return (
        <div key={index} className="flex gap-3 py-4 px-10">
          <UserPicture width="50px"/>
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