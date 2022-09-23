import { Fragment } from "react";
import Channel from "./Channel/Channel";
import UserChat from "./UserChat/UserChat";
import ChannelMenu from "./ChannelMenu";

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

function ChatList({ msg }: { msg: MessageType }) {
  let channelList = [
    { name: "SUS" },
    { name: "seconD" },
    { name: "and the third long" },
  ];
  let DMList = [{name:"user"}, {name:"bis"}, {name:"Johny"}]
  return (
    <div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end">
      <div className="relative">
        <ChannelMenu />
        {channelList.map((Chan, i) => {
          return (
            <div key={i}>
              <Channel name={Chan.name} />
            </div>
          );
        })}
      </div>
      <div className="relative">
        <div className="sticky top-0 px-4 py-3 flex items-center font-semibold text-xl text-slate-900 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-700/90 backdrop-blur-sm ring-1 ring-slate-900/10 dark:ring-black/10">
          DMs
        </div>
        {DMList.map((Chan, i) => {
          return (
            <div key={i}>
              <UserChat name={Chan.name} content={(msg!=undefined ? msg.content:"")} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList
