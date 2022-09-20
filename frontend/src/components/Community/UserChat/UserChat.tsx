import React from "react"
import UserPicture from "../../User Picture/UserPicture";

type Props = {
	name: string;
};

const UserChat: React.FC<Props> = ({name}) => {
	return (
		<div className="flex gap-3 py-4 px-10">
			<UserPicture width="50px"/>
			<div className="">
				<div className="text-lg font-semibold self-center">
					{name}
				</div>
				<div className="text-sm">
					Test message
				</div>
			</div>
		</div>
	)
};

export default UserChat
