import { useState } from "react";
import { IoSend } from "react-icons/io5"

type userType = {
  login: string;
  nickname: string;
//  status: userStatusEnum;
  link_to_profile: string;
}

function TextField ({addMessage} : {addMessage: any}) {
  const user:userType = {login:'Moot', nickname:'mescande', link_to_profile:'Profile'};
  const [value, setValue] = useState<string>('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code == 'Enter' && value.trim() !== '') {
      e.preventDefault();
      addMessage({content:value, sender:user})
      setValue('');
    }
    else if (e.code == 'Enter') {
      e.preventDefault();
      setValue('');
    }
  }

  const handleClick = () => {
    setValue('');
    if (value.trim() !== '')
      addMessage({content:value, sender:user});
  }

  return (
    <div className="px-12 row-span-1 row-start-9 col-span-3 col-start-2 overflow-hidden">
      <div className="flex bg-slate-700 w-5/6 rounded-lg">
        <textarea
          placeholder="Type your message..."
          autoFocus={true}
          rows={3}
          value={value}
          className="w-full bg-slate-700 resize-none"
          id="chat"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IoSend
          size="40"
          onClick={handleClick}
          className="cursor-pointer"
          />
      </div>
    </div>
  )
}

export default TextField