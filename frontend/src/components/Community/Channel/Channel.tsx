import React from "react"

type Props = {
	name: string;
};

const Channel: React.FC<Props> = ({name}) => {
	return (
		<div className="text-lg font-semibold self-center py-4 px-10">
			{name}
		</div>
	)
};

export default Channel
