import { useState } from "react";
import UserPicture from "../User Picture/UserPicture";
import ChatList from "./ChatList/ChatList";
import TextField from "./Text Field/TextField";
import Messages from "./Messages/Messages";

type userType = {
	login: string;
	nickname: string;
	link_to_profile: string;
}
type MessageType = {
	content: string;
	sender: userType;
}

function Chat () {
	const user:userType = {login:'Moot', nickname:'mescande', link_to_profile:'Profile'};
	const [messages, setMessages] = useState<MessageType[]>(
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
		})
	}

	console.log(messages);
	return (
		<div className="bg-black text-white h-7/8 flex grid grid-cols-5 grid-rows-6 gap-4">
			<ChatList msg={messages[messages.length - 1]}/>
			<Messages messages={messages}/>
			<TextField addMessage={addMessage} />
			<div className="row-start-1 row-span-6 col-start-5">
				<UserPicture />
			</div>
		</div>
	)
}

export default Chat