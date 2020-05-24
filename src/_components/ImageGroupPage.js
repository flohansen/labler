import React, { useCallback, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { useSnackbar } from "notistack";

import Database from "../_services/Database";
import AuthContext from "../_contexts/AuthContext";
import HeadLine from "./HeadLine";
import MediaGrid from "./MediaGrid";
import ImageCard from "./ImageCard";

import { TwitterPicker } from "react-color";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { makeStyles } from "@material-ui/core/styles";

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

	images: {
		width: "100%"
	},

	labelHeader: {
		display: "flex",
		justifyContent: "space-between"
	},

	chip: {
		margin: 5,
		color: theme.palette.primary.contrastText
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
	const [labels, setLabels] = useState([]);

	const handleFilesPicked = async event => {
		const files = event.target.files;

		if (files.length > 0) {
			const response = await Database.uploadImages(token, imageGroupId, files);

			if (response.success) {
				enqueueSnackbar("Uploaded files successfully", { variant: "success" });
				updateImages();
			} else {
				enqueueSnackbar("An error occured while uploading files", {
					variant: "error"
				});
			}
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
			updateLabels();
		} else {
			enqueueSnackbar("Could not create new label", { variant: "error" });
		}

		setDialogOpen(false);
	};

	const updateLabels = useCallback(async () => {
		const request = await Database.getLabels(token, imageGroupId);

		if (request.success) {
			setLabels(request.labels);
		}
	}, [imageGroupId, token]);

	const updateImages = useCallback(async () => {
		const request = await Database.getImages(token, imageGroupId);

		if (request.success) {
			setHeading(request.imageGroup.name);
			setImages(request.imageGroup.images);
		}
	}, [token, imageGroupId]);

	useEffect(() => {
		updateImages();
		updateLabels();
	}, [updateImages, updateLabels]);

	return (
		<>
			<div className={classes.root}>
				<div className={classes.images}>
					<HeadLine title={heading}>
						<input
							type="file"
							multiple
							onChange={handleFilesPicked}
							id="contained-button-file"
							style={{ display: "none" }}
						/>
						<label htmlFor="contained-button-file">
							<Button
								size="small"
								startIcon={<CloudUploadIcon />}
								component="span"
								variant="contained"
								color="primary"
							>
								Upload
							</Button>
						</label>
						<Button
							size="small"
							startIcon={<AddIcon />}
							component="span"
							variant="contained"
							color="primary"
							onClick={handleClickAddLabel}
						>
							Label
						</Button>
					</HeadLine>

					<MediaGrid columns={4}>
						{images.map((img, idx) => {
							const handleClick = () => {
								history.push(
									`/app/imageGroups/${imageGroupId}/images/${img.id}`
								);
							};

							return (
								<ImageCard
									checked={img.labelings > 0}
									onClick={handleClick}
									key={idx}
									src={`https://volbyte.com:5000/${img.filename}`}
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
					</div>
					<div>
						{labels.map(label => {
							const handleDeleteLabel = async () => {
								const response = await Database.deleteLabel(
									token,
									label.id,
									imageGroupId
								);

								if (response.success) {
									enqueueSnackbar("Label has been deleted", {
										variant: "success"
									});
									updateLabels();
								} else {
									enqueueSnackbar("Could not delete label", {
										variant: "error"
									});
								}
							};

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
