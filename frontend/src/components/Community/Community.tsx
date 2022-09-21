import React, { KeyboardEvent, useState, ComponentProps } from "react";
import UserPicture from "../User Picture/UserPicture";
import ChatList from "./ChatList/ChatList";
//import { userStatusEnum } from "../FriendList";
import { IoSend } from "react-icons/io5";
import { Link } from "react-router-dom";

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

const Msg = (props:MessageType) => {
	return (
		<div className="flex gap-3 py-4 px-10">
			<UserPicture width="50px"/>
			<div className="">
				<div className="text-lg font-semibold self-center">
					{props.sender.nickname}
				</div>
				<div className="text-sm">
					{props.content}
				</div>
			</div>
		</div>
	)
}

function Community () {
	const user:userType = {login:'Moot', nickname:'mescande', link_to_profile:'Profile'};
	const [value, setValue] = useState('')
	const [Messages, setMessages] = useState<MessageType[]>(
	() => {
		let tmp:MessageType[] = []
		let i:number = 0
		while (i < 10) {
			tmp.push({content:i.toString(), sender:user})
			i++;
		}
		return tmp
		});

	const addMessage = (newElem:MessageType) => {
		setMessages((current_messages)=>{
		return [...current_messages, newElem];
	})}

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.code == 'Enter') {
			addMessage({content:value, sender:user})
			setValue('')
	}}

	console.log(Messages);
	return (
		<div className="bg-black text-white h-7/8 flex grid grid-cols-5 grid-rows-6 gap-4">
			<div className="h-full row-start-1 row-span-6 col-start-1 self-center scroll-smooth overflow-y-auto overflow-scroll scroll-pb-96 snap-y snap-end">
				<ChatList />
			</div>
			<div className="row-span-5 col-span-3 scroll-smooth overflow-y-auto">
				{Messages.map((Message) => {
					return <Msg {...Message} />
				})}
			</div>
			<div className="px-12 row-span-1 row-start-9 col-span-3 col-start-2 overflow-hidden">
				<div className="flex bg-slate-300 w-5/6 rounded-lg">
					<textarea
						placeholder="Type your message..."
						autoFocus={true}
						rows={3}
						value={value}
						className="w-full bg-slate-300" id="chat"
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<div onClick={() => {addMessage({content:value, sender:user})}}>
						<IoSend size="40" />
					</div>
				</div>
			</div>
			<div className="row-start-1 row-span-6 col-start-5">
				<UserPicture />
			</div>
		</div>
	)
}

export default Community