import { useRef } from "react";
import UserPicture from "../../User Picture/UserPicture";

type userType = {
  login: string;
  nickname: string;
//  status: userStatusEnum;
  link_to_profile: string;
}
type MessageType = {
  content: string;
  sender: userType;
}

const Messages = ({messages}: {messages:MessageType[]}) => {
  const containerRef = useRef();
  const refAssignCallback = (ref: any) => {
    if (!containerRef.current && ref) {
      containerRef.current = ref;
      containerRef.current.scrollTop = containerRef.current.scrollHeight - containerRef.current.getBoundingClientRect().height;
    } else {
      //otherwise just assign/unassigned
      containerRef.current = ref;
    }
  };

  return (
    <div 
      ref={refAssignCallback}
      className="row-span-5 col-span-3 scroll-smooth overflow-y-auto">
      {messages.map((message, index) => {
      return (
        <div key={index} className="flex gap-3 py-4 px-10">
          <UserPicture width="50px"/>
          <div className="">
            <h6 className="text-lg font-semibold self-center">
              {message.sender.nickname}
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