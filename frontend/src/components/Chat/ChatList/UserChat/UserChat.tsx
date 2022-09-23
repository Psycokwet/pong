import React from "react"
import UserPicture from "../../../User Picture/UserPicture";

type Props = {
  name: string;
  content: string;
};

const UserChat: React.FC<Props> = ({name, content}) => {
  const handleClick = () => {}
  return (
    <div className="max-w-full flex gap-3 py-4 px-10 hover:bg-slate-800 cursor-pointer"
      onClick={handleClick}>
      <UserPicture width="50px"/>
      <div className="max-width-full">
        <div className="max-w-full truncate text-lg font-semibold self-center">
          {name}
        </div>
        <div className="max-w-full truncate text-sm">
          {content}
        </div>
      </div>
    </div>
  )
};

export default UserChat
