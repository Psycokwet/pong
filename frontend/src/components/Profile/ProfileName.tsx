import React from "react"
import UserPicture from "../User Picture/UserPicture";
import { Link } from "react-router-dom";

type ProfileNameProps = {
	nickname?: string,
}

const ProfileName:React.FC<ProfileNameProps> = ({nickname}) => {
	return (
		<div className="flex flex-row gap-8 self-center">
			<UserPicture width="150px" />
			<div className="self-center">
				<Link to="/profile">
					<h1 className="text-xl font-mono font-bold">{nickname} </h1>
				</Link>
			</div>
		</div>
	)
    }

export default ProfileName