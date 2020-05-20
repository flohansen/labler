import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useSnackbar } from "notistack";

import Database from "../_services/Database";
import AuthContext from "../_contexts/AuthContext";
import HeadLine from "./HeadLine";
import MediaGrid from "./MediaGrid";
import ImageGroup from "./ImageGroup";

import { TwitterPicker } from "react-color";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Fab from "@material-ui/core/Fab";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
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

	labelHeader: {
		display: "flex",
		justifyContent: "space-between"
	},

	chip: {
		margin: 5
	},

	input: {
		marginBottom: 25
	},

	label: {
		marginBottom: 5,
		display: "block"
	}
}));

const ImageGroupPage = ({ ...props }) => {
	const classes = useStyles();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();

	const imageGroupId = props.match.params.groupId;
	const {
		token: [token]
	} = useContext(AuthContext);
	const [heading, setHeading] = useState("");
	const [images, setImages] = useState([]);
	const [newLabelName, setNewLabelName] = useState("New Label");
	const [newLabelColor, setNewLabelColor] = useState("#e4e4e4");
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleFilesPicked = async event => {
		const files = event.target.files;

		if (files.length > 0) {
			await Database.uploadImages(token, imageGroupId, files);
		}
	};

	const handleClickAddLabel = () => {
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleChangeNewLabelColor = event => {
		setNewLabelColor(event.rgb);
	};

	const handleChangeNewLabelName = event => {
		setNewLabelName(event.currentTarget.value);
	};

	const handleCreateLabel = async () => {
		const rgb = newLabelColor;
		const labelColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;

		const response = await Database.createLabel(
			token,
			newLabelName,
			labelColor,
			imageGroupId
		);

		if (response.success) {
			enqueueSnackbar("New label was created", { variant: "success" });
		} else {
			enqueueSnackbar("Could not create new label", { variant: "error" });
		}

		setDialogOpen(false);
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
					<div className={classes.labelHeader}>
						<Typography variant="overline">Labels</Typography>
						<Fab size="small" color="primary" onClick={handleClickAddLabel}>
							<AddIcon />
						</Fab>
					</div>
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

			<Dialog open={dialogOpen} onClose={handleCloseDialog}>
				<DialogTitle>Create new label</DialogTitle>
				<DialogContent>
					<TextField
						value={newLabelName}
						onChange={handleChangeNewLabelName}
						className={classes.input}
						label="Label name"
						margin="dense"
						autoFocus
						fullWidth
					/>
					<Typography className={classes.label} variant="caption">
						Choose a color
					</Typography>
					<TwitterPicker
						color={newLabelColor}
						onChange={handleChangeNewLabelColor}
						triangle="hide"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleCreateLabel} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ImageGroupPage;
