import React, { useState, useEffect, useContext } from "react";

import Database from "../_services/Database";
import AuthContext from "../_contexts/AuthContext";
import HeadLine from "./HeadLine";

import Button from "@material-ui/core/Button";

const ImageGroupPage = ({ ...props }) => {

	const { token: [token,] } = useContext(AuthContext);
	const [heading, setHeading] = useState('');

	const handleUploadClick = () => {
	};

	useEffect(() => {
		(async () => {
			const imageGroupId = props.match.params.groupId;
			const request = await Database.getImages(token, imageGroupId);

			if (request.success) {
				setHeading(request.imageGroup.name);
			}
		})();
	}, [token, props.match.params.groupId]);

	return (
		<>
			<HeadLine title={heading}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleUploadClick}
				>
					Upload
				</Button>
			</HeadLine>
		</>
	);

};

export default ImageGroupPage;
