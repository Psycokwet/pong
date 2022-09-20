import React, { useState, ComponentProps } from "react";
import UserPicture from "../User Picture/UserPicture";
import Channel from "./Channel/Channel";
import UserChat from "./UserChat/UserChat";

import { IoStarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

function Community () {
	let ChannelList = [{name:"SUS"}, {name:"seconD"}, {name:"and the third long"}]
	let DMList = [{name:"user"}, {name:"bis"}, {name:"Johny"}]
	let text;
	return (
		<div className="bg-black text-white h-7/8 flex grid grid-cols-5 grid-rows-6 gap-4">
			<div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end">
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
			<div className="row-span-5 col-span-3 scroll-smooth overflow-y-auto">
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
				<UserPicture />
			</div>
			<div className="row-span-1 row-start-9 col-span-3 col-start-2 overflow-hidden">
				<input id={text}></input>
				<UserPicture />
			</div>
			<div className="row-start-1 row-span-6 col-start-5">
				<UserPicture />
			</div>
		</div>
	)
}

export default Community