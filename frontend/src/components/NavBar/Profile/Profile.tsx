import React, { useState, ComponentProps } from "react";
import {Routes, Route, Link } from "react-router-dom";
import NavBar from "../";
import "./Profile.css";
import UserPicture from "./User Picture/UserPicture";
import { PieChart } from "react-minimal-pie-chart";

export function ProfileName () {
	return (
		<div className="flex flex-row gap-8 self-center">
			<UserPicture width="150px" />
			<div className="self-center">
				<Link to="/profile">
					<h1 className="text-xl font-mono font-bold">Profile</h1>
				</Link>
			</div>
		</div>
	)
}


function MatchHistory () {
	return (
		<div className="grid grid-cols-3 place-content-around place-items-center">
			<div>Date</div>
			<div>Score</div>
			<div>Opponent</div>
			<div>10/09 13:50</div>
			<div>10-2</div>
			<div>nickname</div>
			<div>7</div>
			<div>8</div>
			<div>9</div>
			<div>1</div>
			<div>2</div>
			<div>3</div>
			<div>4</div>
			<div>5</div>
			<div>6</div>
			<div>7</div>
			<div>8</div>
			<div>9</div>
		</div>
	)
}

function Stats () {
	let wins=10
	let looses=2
	let abandons=1
	const [selected, setSelected] = useState<number | undefined>(undefined);
	const [hovered, setHovered] = useState<number | undefined>(undefined);

	const dataMock = [{ title: 'Wins', value: wins, color: '#158727' },
				{ title: 'Looses', value: looses, color: '#8B0000' },
				{ title: 'Abandons', value: abandons, color: '#4D1DD8' }]
	const data = dataMock.map((entry, i) => {
		if (hovered === i) {
			return {
				...entry,
				color: 'grey',
			};
		}
		return entry;
	});

	return (
		<PieChart
			data={data}
			lineWidth={40}
			startAngle={75}
			paddingAngle={7}
			segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
			segmentsShift={(index) => (index === selected ? 3 : 1)}
			label={({ dataEntry }) => dataEntry.value}
			labelStyle={(index) => ({
				fill: 'white',
				fontSize: '5px',
			})}
			labelPosition={112}
			radius={30}
			onClick={(event, index) => {
				console.log('CLICK', { event, index });
				setSelected(index === selected ? undefined : index);
			}}
			onMouseOver={(_, index) => {
				setHovered(index);
			}}
			onMouseOut={() => {
				setHovered(undefined);
			}}
		/>
	)
}

function Profile () {
	let star = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/800px-Empty_Star.svg.png';
	return (
		<div className="bg-black text-white h-screen flex grid grid-cols-10 grid-rows-6 gap-8">
			<div className="col-start-2 col-span-3 row-start-2">
				<ProfileName />
			</div>
			<div className="row-start-2 row-span-3 col-start-6 col-span-3">
				<MatchHistory />
			</div>
			<div className="row-start-3 flex flex-row col-start-2 col-span-3 max-h-[22rem]">
				<div className="self-center">
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
						<h1 className="text-l font-mono font-semibold">1st !</h1>
					</Link>
				</div>
			</div>
			<div className="col-span-10"/>
			<div className="col-start-2 col-span-3 row-span-3">
				<Stats />
			</div>
			<div className="col-start-6 col-span-3 row-start-5">
				<ProfileName />
			</div>
			<div className="col-span-10"/>
		</div>
		)
}

export default Profile