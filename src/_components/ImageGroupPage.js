import React, { useState, useEffect, useContext } from "react";

import Database from "../_services/Database";
import AuthContext from "../_contexts/AuthContext";
import HeadLine from "./HeadLine";

import Button from "@material-ui/core/Button";

const ImageGroupPage = ({ ...props }) => {

	const imageGroupId = props.match.params.groupId;
	const { token: [token,] } = useContext(AuthContext);
	const [heading, setHeading] = useState('');

	const handleFilesPicked = async event => {
		const files = event.target.files;

		if (files.length > 0) {
			await Database.uploadImages(token, imageGroupId, files);
		}
	};

	useEffect(() => {
		(async () => {
			const request = await Database.getImages(token, imageGroupId);

			if (request.success) {
				setHeading(request.imageGroup.name);
			}
		})();
	}, [token, props.match.params.groupId, imageGroupId]);

	return (
		<>
			<HeadLine title={heading}>
				<input
					type="file"
					multiple
					onChange={handleFilesPicked}
					id="contained-button-file"
					style={{ display: 'none' }}
				/>
				<label htmlFor="contained-button-file">
					<Button
						component="span"
						variant="contained"
						color="primary"
					>
						Upload
					</Button>
				</label>
			</HeadLine>
		</>
	);

};

export default ImageGroupPage;
