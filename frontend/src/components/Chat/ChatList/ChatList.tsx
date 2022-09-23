import Channel from "./Channel/Channel";
import UserChat from "./UserChat/UserChat";

type userType = {
	login: string;
	nickname: string;
//	status: userStatusEnum;
	link_to_profile: string;
}
type MessageType = {
	content: string;
	sender: userType;
}

function ChatList ({msg} : {msg:MessageType}) {
	let ChannelList = [{name:"SUS"}, {name:"seconD"}, {name:"and the third long"}]
	let DMList = [{name:"user"}, {name:"bis"}, {name:"Johny"}]
	return (
		<div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end">
			<div className="relative">
				<div className="sticky top-0 px-4 py-3 flex items-center font-semibold text-xl text-slate-200 bg-slate-700/90 backdrop-blur-sm ring-1 ring-black/10">Channels</div>
				{ChannelList.map((Chan) => {
					return (
						<Channel name={Chan.name} />
					);
				})}
			</div>
			<div className="relative">
				<div className="sticky top-0 px-4 py-3 flex items-center font-semibold text-xl text-slate-900 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-700/90 backdrop-blur-sm ring-1 ring-slate-900/10 dark:ring-black/10">DMs</div>
				{DMList.map((Chan) => {
					return (
						<UserChat name={Chan.name} content={msg.content} />
					);
				})}
			</div>
		</div>
	)
}

export default ChatList;
