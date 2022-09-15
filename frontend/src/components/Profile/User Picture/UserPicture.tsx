import { Link } from "react-router-dom";

const UserPicture = ({border_radius='50%', width='200px'}) => {
	let imageURL = 'https://picsum.photos/400';
	const Avatar = {
		borderRadius: border_radius,
		width: width,
		overflow: "hidden"
	};
	return (
		<div className="flex flex-row">
			<Link to="/Profile" style={Avatar}>
				<img
					src={imageURL}
					alt="Avatar"/>
			</Link>
		</div>
	)
}

export default UserPicture