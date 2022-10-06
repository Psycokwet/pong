import { useRef } from "react";
import UserPicture from "../../UserPicture/UserPicture";
import Message from "shared/interfaces/Message";
const Messages = ({ messages }: { messages: Message[] }) => {
  const containerRef = useRef();
  const refAssignCallback = (ref: any) => {
    if (!containerRef.current && ref) {
      ref.scrollTop = ref.scrollHeight - ref.getBoundingClientRect().height;
      containerRef.current = ref;
    } else {
      //otherwise just assign/unassigned
      containerRef.current = ref;
    }
  };

  return (
    <div
      ref={refAssignCallback}
      className="row-span-5 col-span-3 scroll-smooth overflow-y-auto"
    >
      {messages.map((message, index) => {
        return (
          <div key={index} className="flex gap-3 py-4 px-10">
            <UserPicture width="50px" />
            <div className="">
              <h6 className="text-lg font-semibold self-center">
                {message.author}
              </h6>
              <p className="break-all max-w-full whitespace-pre-wrap text-sm">
                {message.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
