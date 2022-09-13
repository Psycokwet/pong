import React from "react";
import {Routes, Route, Link } from "react-router-dom";
import User from "../NavBar/Pages-To-Change/User";
import "./Profile.css";
import UserPicture from "./User Picture/UserPicture";


function Profile () {
	let star = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/800px-Empty_Star.svg.png';
	return (
		<div style={{backgroundColor: "black", color: "white", height: "100vh"}}>
			<UserPicture />
			<span>
				<Link to="/profile">Profile</Link>
				<div className="flex flex-row">
					<div>
						<Link to="/leaderboard"> 
							<img
								src={star}
								alt="LeaderBoard"
								width={'40px'}
							/>
						</Link>
					</div>
					<div className="self-center">
						<Link to="/leaderboard">
							1st !
						</Link>
					</div>
				</div>
			</span>
		</div>
		)
}

export default Profile