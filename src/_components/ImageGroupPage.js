import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import Database from "../_services/Database";
import AuthContext from "../_contexts/AuthContext";
import HeadLine from "./HeadLine";
import MediaGrid from "./MediaGrid";
import ImageGroup from "./ImageGroup";

import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const labels = [
	{
		name: "Schuhe"
	},
	{
		name: "Socken"
	},
	{
		name: "Handschuhe"
	}
];

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex"
	},

	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},

	drawerPaper: {
		marginTop: 65,
		height: `calc(100vh - 65px)`,
		width: drawerWidth,
		padding: 15
	},

	chip: {
		margin: 5
	}
}));

const ImageGroupPage = ({ ...props }) => {
	const classes = useStyles();
	const history = useHistory();

	const imageGroupId = props.match.params.groupId;
	const {
		token: [token]
	} = useContext(AuthContext);
	const [heading, setHeading] = useState("");
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
			<div className={classes.root}>
				<div>
					<HeadLine title={heading}>
						<input
							type="file"
							multiple
							onChange={handleFilesPicked}
							id="contained-button-file"
							style={{ display: "none" }}
						/>
						<label htmlFor="contained-button-file">
							<Button component="span" variant="contained" color="primary">
								Upload
							</Button>
						</label>
					</HeadLine>

					<MediaGrid columns={4}>
						{images.map((img, idx) => {
							const handleClick = () => {
								history.push(
									`/app/imageGroups/${imageGroupId}/images/${img.id}`
								);
							};

							return (
								<ImageGroup
									onClick={handleClick}
									key={idx}
									src={`http://localhost:5000/${img.filename}`}
									subtitle={img.name}
									alt=""
								/>
							);
						})}
					</MediaGrid>
				</div>

				<Drawer
					classes={{ paper: classes.drawerPaper }}
					className={classes.drawer}
					anchor="right"
					variant="permanent"
				>
					<Typography variant="overline">Labels</Typography>
					<div>
						{labels.map(label => {
							const handleDeleteLabel = () => {};
							return (
								<Chip
									className={classes.chip}
									key={label.name}
									size="small"
									label={label.name}
									onDelete={handleDeleteLabel}
									style={{ background: label.color }}
								/>
							);
						})}
					</div>
				</Drawer>
			</div>
		</>
	);
};

export default ImageGroupPage;
