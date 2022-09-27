import React from "react"
import UserPicture from "../User Picture/UserPicture";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProfilePic from "../Common/ProfilePic";



type ProfileNameProps = {
	nickname?: string,
}

const ProfileName:React.FC<ProfileNameProps> = ({nickname}) => {
	const [user_pic, setUserPic] = useState("");
	return (
		<div className="flex flex-row gap-8 self-center">
			<ProfilePic avatar={user_pic} setAvatar={setUserPic}/>
			<div className="self-center">
				<Link to="/profile">
					<h1 className="text-xl font-mono font-bold">{nickname} </h1>
				</Link>
			</div>
		</div>
	)
    }

export default ProfileName