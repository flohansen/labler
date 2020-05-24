import React, {
	useCallback,
	useState,
	useContext,
	useRef,
	useEffect
} from "react";

import { useHistory } from "react-router-dom";

import AuthContext from "../_contexts/AuthContext";
import Database from "../_services/Database";

import Chip from "@material-ui/core/Chip";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		width: `calc(100% - ${drawerWidth}px)`,
		height: "calc(100vh - 65px - 50px)"
	},

	canvas: {
		display: "block",
		width: "100%",
		height: "100%"
	},

	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},

	drawerPaper: {
		marginTop: 65,
		paddingTop: 16,
		height: "calc(100vh - 65px)",
		width: drawerWidth
	},

	chipLabel: {
		marginBottom: 8,
		marginLeft: 16,
		marginRight: 16
	}
}));

const EditorPage = ({ ...props }) => {
	const history = useHistory();
	const classes = useStyles();
	const canvasRef = useRef(null);
	const { imageGroupId, imageId } = props.match.params;
	const {
		token: [token]
	} = useContext(AuthContext);

	const [next, setNext] = useState(null);
	const [prev, setPrev] = useState(null);
	const [image, setImage] = useState(null);
	const [labels, setLabels] = useState([]);
	const [labelings, setLabelings] = useState([]);
	const [selectedLabel, setSelectedLabel] = useState({});

	const handleKeyDown = useCallback(
		event => {
			console.log(event.keyCode);

			switch (event.keyCode) {
				case 37:
					if (prev) {
						history.push(`/app/imageGroups/${imageGroupId}/images/${prev.id}`);
					}
					break;

				case 39:
					if (next) {
						history.push(`/app/imageGroups/${imageGroupId}/images/${next.id}`);
					}
					break;

				default:
			}
		},
		[history, prev, next, imageGroupId]
	);

	const updateRects = useCallback(async () => {
		const response = await Database.getLabelings(token, imageId, imageGroupId);

		if (response.success) {
			setLabelings(response.labelings);
		}
	}, [imageGroupId, imageId, token]);

	const updateImages = useCallback(async () => {
		const response = await Database.getImages(token, imageGroupId);

		if (response.success) {
			const current = response.imageGroup.images.find(
				i => i.id === parseInt(imageId)
			);

			const currentIndex = response.imageGroup.images.indexOf(current);
			const prevIndex = currentIndex - 1;
			const nextIndex = currentIndex + 1;

			setPrev(response.imageGroup.images[prevIndex]);

			setNext(response.imageGroup.images[nextIndex]);
		}
	}, [token, imageGroupId, imageId]);

	useEffect(() => {
		const canvas = canvasRef.current;

		const ctx = canvas.getContext("2d");
		const cursorColor = "rgba(0, 0, 0, 0.3)";

		const cursor = { x: 0, y: 0 };
		const start = { x: -10, y: -10, isSet: false };
		const end = { x: -10, y: -10 };

		const resizeCanvas = () => {
			const parentRect = canvas.parentElement.getBoundingClientRect();
			canvas.width = parentRect.width;
			canvas.height = parentRect.height;
		};

		const getRectAt = (x, y) => {
			let rect = null;

			for (let i = labelings.length - 1; i >= 0 && rect == null; i--) {
				const r = labelings[i];

				if (x >= r.startx && x <= r.endx && y >= r.starty && y <= r.endy) {
					rect = r;
				}
			}

			return rect;
		};

		const handleMouseMove = event => {
			cursor.x = event.offsetX;
			cursor.y = event.offsetY;

			if (start.isSet) {
				end.x = event.offsetX / canvas.width;
				end.y = event.offsetY / canvas.height;
			}

			draw();
		};

		const handleClick = event => {
			if (!start.isSet) {
				start.x = event.offsetX / canvas.width;
				start.y = event.offsetY / canvas.height;
				end.x = start.x;
				end.y = start.y;
				start.isSet = true;
			} else {
				end.x = event.offsetX / canvas.width;
				end.y = event.offsetY / canvas.height;

				let rect = null;

				if (start.x <= end.x && start.y <= end.y) {
					rect = {
						start: {
							x: start.x,
							y: start.y
						},
						end: {
							x: end.x,
							y: end.y
						}
					};
				} else if (start.x <= end.x && start.y > end.y) {
					rect = {
						start: {
							x: start.x,
							y: end.y
						},
						end: {
							x: end.x,
							y: start.y
						}
					};
				} else if (start.x > end.x && start.y <= end.y) {
					rect = {
						start: {
							x: end.x,
							y: start.y
						},
						end: {
							x: start.x,
							y: end.y
						}
					};
				} else {
					rect = {
						start: {
							x: end.x,
							y: end.y
						},
						end: {
							x: start.x,
							y: start.y
						}
					};
				}

				rect.start.x = parseInt(rect.start.x * image.width);
				rect.end.x = parseInt(rect.end.x * image.width);
				rect.start.y = parseInt(rect.start.y * image.height);
				rect.end.y = parseInt(rect.end.y * image.height);

				(async () => {
					const response = await Database.createLabeling(
						token,
						rect.start,
						rect.end,
						selectedLabel.id,
						imageId,
						imageGroupId
					);

					if (response.success) {
						updateRects();
					}
				})();

				end.x = -10;
				end.y = -10;
				start.x = -10;
				start.y = -10;
				start.isSet = false;
			}

			draw();
		};

		const handleRightClick = event => {
			event.preventDefault();

			const rect = getRectAt(
				(event.offsetX / canvas.width) * image.width,
				(event.offsetY / canvas.height) * image.height
			);

			if (rect != null) {
				(async () => {
					const response = await Database.deleteLabeling(
						token,
						rect.id,
						imageId,
						imageGroupId
					);

					if (response.success) {
						updateRects();
					}
				})();
			}

			draw();
		};

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (image) {
				ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
			}

			ctx.beginPath();
			ctx.rect(cursor.x, 0, 1, canvas.height);
			ctx.fillStyle = cursorColor;
			ctx.fill();

			ctx.beginPath();
			ctx.rect(0, cursor.y, canvas.width, 1);
			ctx.fillStyle = cursorColor;
			ctx.fill();

			if (image) {
				for (const labeling of labelings) {
					const start = {
						x: labeling.startx / image.width,
						y: labeling.starty / image.height
					};

					const end = {
						x: labeling.endx / image.width,
						y: labeling.endy / image.height
					};

					const label = labels.find(l => l.id === labeling.labelid);

					if (label) {
						ctx.fillStyle = label.color;
						ctx.font = "bold 16px Arial";
						ctx.fillText(
							label.name,
							start.x * canvas.width,
							start.y * canvas.height - 5
						);

						ctx.save();
						ctx.beginPath();
						ctx.rect(
							start.x * canvas.width,
							start.y * canvas.height,
							(end.x - start.x) * canvas.width,
							(end.y - start.y) * canvas.height
						);
						ctx.globalAlpha = 0.3;
						ctx.fillStyle = label.color;
						ctx.fill();
						ctx.restore();
					}
				}
			}

			ctx.beginPath();
			ctx.rect(
				start.x * canvas.width,
				start.y * canvas.height,
				(end.x - start.x) * canvas.width,
				(end.y - start.y) * canvas.height
			);
			ctx.fillStyle = "rgba(51, 153, 255, 0.3)";
			ctx.fill();

			ctx.beginPath();
			ctx.rect(start.x * canvas.width - 5, start.y * canvas.height - 5, 10, 10);
			ctx.fillStyle = "#fff";
			ctx.strokestyle = "#000";
			ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.rect(end.x * canvas.width - 5, end.y * canvas.height - 5, 10, 10);
			ctx.fillStyle = "#fff";
			ctx.strokestyle = "#000";
			ctx.fill();
			ctx.stroke();
		};

		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("click", handleClick);
		canvas.addEventListener("contextmenu", handleRightClick);
		window.addEventListener("keydown", handleKeyDown);

		resizeCanvas();
		draw();

		return () => {
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("click", handleClick);
			canvas.removeEventListener("contextmenu", handleRightClick);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		handleKeyDown,
		updateRects,
		image,
		selectedLabel,
		labels,
		labelings,
		imageId,
		imageGroupId,
		token
	]);

	useEffect(() => {
		(async () => {
			const response = await Database.getImage(token, imageId);

			if (response.success) {
				const img = new Image();

				img.onload = () => {
					setImage(img);
				};

				img.src = `https://volbyte.com:5000/${response.image.filename}`;
			}
		})();

		(async () => {
			const response = await Database.getLabels(token, imageGroupId);

			if (response.success) {
				setLabels(response.labels);
				setSelectedLabel(response.labels[0] ?? null);
			}
		})();

		updateRects();
		updateImages();
	}, [updateRects, updateImages, imageId, token, imageGroupId]);

	return (
		<div className={classes.root}>
			<canvas className={classes.canvas} ref={canvasRef}></canvas>
			<Drawer
				anchor="right"
				className={classes.drawer}
				classes={{ paper: classes.drawerPaper }}
				variant="permanent"
			>
				{labels.map(label => {
					const handleClick = () => {
						setSelectedLabel(label);
					};

					return (
						<Chip
							key={label.name}
							label={label.name}
							style={{
								background: selectedLabel === label ? label.color : "#e4e4e4"
							}}
							onClick={handleClick}
							className={classes.chipLabel}
							clickable
						/>
					);
				})}
			</Drawer>
		</div>
	);
};

export default EditorPage;
