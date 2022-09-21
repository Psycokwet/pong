
import Channel from "./Channel/Channel";
import UserChat from "./UserChat/UserChat";

function ChatList () {
	let ChannelList = [{name:"SUS"}, {name:"seconD"}, {name:"and the third long"}]
	let DMList = [{name:"user"}, {name:"bis"}, {name:"Johny"}]
	return (
		<div>
			<div className="relative">
				<div className="sticky top-0 px-4 py-3 flex items-center font-semibold text-xl text-slate-900 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-700/90 backdrop-blur-sm ring-1 ring-slate-900/10 dark:ring-black/10">Channels</div>
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
						<UserChat name={Chan.name} />
					);
				})}
			</div>
		</div>
	)
}

export default ChatList;
