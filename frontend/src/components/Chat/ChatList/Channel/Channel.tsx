import React from "react"

type Props = {
  name: string;
};

const Channel: React.FC<Props> = ({name}) => {
  const handleClick = () => {}
  return (
    <div className="max-w-full truncate text-lg font-semibold self-center py-4 px-10 hover:bg-slate-800 cursor-pointer"
      onClick={handleClick}>
      {name}
    </div>
  )
};

export default Channel
