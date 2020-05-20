import React, { useState, useContext, useRef, useEffect } from "react";

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
	const classes = useStyles();
	const canvasRef = useRef(null);
	const { imageGroupId, imageId } = props.match.params;
	const {
		token: [token]
	} = useContext(AuthContext);

	const [rects, setRects] = useState([]);
	const [image, setImage] = useState(null);
	const [labels, setLabels] = useState([]);
	const [selectedLabel, setSelectedLabel] = useState({});

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

			for (let i = rects.length - 1; i >= 0 && rect == null; i--) {
				const r = rects[i];

				if (x >= r.start.x && x <= r.end.x && y >= r.start.y && y <= r.end.y) {
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

				if (start.x <= end.x && start.y <= end.y) {
					setRects(rects => [
						...rects,
						{
							label: selectedLabel,
							start: {
								x: start.x,
								y: start.y
							},
							end: {
								x: end.x,
								y: end.y
							}
						}
					]);
				} else if (start.x <= end.x && start.y > end.y) {
					setRects(rects => [
						...rects,
						{
							label: selectedLabel,
							start: {
								x: start.x,
								y: end.y
							},
							end: {
								x: end.x,
								y: start.y
							}
						}
					]);
				} else if (start.x > end.x && start.y <= end.y) {
					setRects(rects => [
						...rects,
						{
							label: selectedLabel,
							start: {
								x: end.x,
								y: start.y
							},
							end: {
								x: start.x,
								y: end.y
							}
						}
					]);
				} else {
					setRects(rects => [
						...rects,
						{
							label: selectedLabel,
							start: {
								x: end.x,
								y: end.y
							},
							end: {
								x: start.x,
								y: start.y
							}
						}
					]);
				}

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
				event.offsetX / canvas.width,
				event.offsetY / canvas.height
			);

			if (rect != null) {
				setRects(rects => rects.filter(r => r !== rect));
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

			for (const rect of rects) {
				const start = rect.start;
				const end = rect.end;

				ctx.fillStyle = rect.label.color;
				ctx.font = "bold 16px Arial";
				ctx.fillText(
					rect.label.name,
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
				ctx.fillStyle = rect.label.color;
				ctx.fill();
				ctx.restore();
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

		resizeCanvas();
		draw();

		return () => {
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("click", handleClick);
			canvas.removeEventListener("contextmenu", handleRightClick);
		};
	}, [image, selectedLabel, rects]);

	useEffect(() => {
		(async () => {
			const response = await Database.getImage(token, imageId);

			if (response.success) {
				const img = new Image();

				img.onload = () => {
					setImage(img);
				};

				img.src = `http://localhost:5000/${response.image.filename}`;
			}
		})();

		(async () => {
			const response = await Database.getLabels(token, imageGroupId);

			if (response.success) {
				setLabels(response.labels);
				setSelectedLabel(response.labels[0] ?? null);
			}
		})();
	}, [imageId, token, imageGroupId]);

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
