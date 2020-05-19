import React, { useState, useEffect, useContext } from "react";

import Database from "../_services/Database";
import AuthContext from "../_contexts/AuthContext";
import HeadLine from "./HeadLine";
import MediaGrid from "./MediaGrid";
import ImageGroup from "./ImageGroup";

import Button from "@material-ui/core/Button";

const ImageGroupPage = ({ ...props }) => {

	const imageGroupId = props.match.params.groupId;
	const { token: [token,] } = useContext(AuthContext);
	const [heading, setHeading] = useState('');
	const [images, setImages] = useState([]);

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
				setImages(request.imageGroup.images);
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

			<MediaGrid columns={4}>
				{images.map((img, idx) => {
					return (
						<ImageGroup
							key={idx}
							src={`http://localhost:5000/${img.filename}`}
							subtitle={img.name}
							alt=""
						/>
					);
				}	)}
			</MediaGrid>
		</>
	);

};

export default ImageGroupPage;
