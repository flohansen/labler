import React, { useContext, useRef, useEffect } from "react";

import AuthContext from "../_contexts/AuthContext";
import Database from "../_services/Database";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({

	canvas: {
		display: 'block',
		width: '100%',
		height: '100%'
	}

}));

const EditorPage = ({ ...props }) => {
	const classes = useStyles();
	const canvasRef = useRef(null);
	const imageId = props.match.params.imageId;
	const { token: [token,] } = useContext(AuthContext);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const img = new Image();
		const cursorColor = 'rgba(0, 0, 0, 0.3)';

		const cursor = { x: 0, y: 0 };
		const start = { x: -10, y: -10, isSet: false };
		const end = { x: -10, y: -10 };
		let rects = [];

		const resizeCanvas = () => {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
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
					rects.push({
						start: {
							x: start.x,
							y: start.y
						},
						end: {
							x: end.x,
							y: end.y
						}
					});
				} else if (start.x <= end.x && start.y > end.y) {
					rects.push({
						start: {
							x: start.x,
							y: end.y
						},
						end: {
							x: end.x,
							y: start.y
						}
					});
				} else if (start.x > end.x && start.y <= end.y) {
					rects.push({
						start: {
							x: end.x,
							y: start.y
						},
						end: {
							x: start.x,
							y: end.y
						}
					});
				} else {
					rects.push({
						start: {
							x: end.x,
							y: end.y
						},
						end: {
							x: start.x,
							y: start.y
						}
					});
				}

				end.x = -10;
				end.y = -10;
				start.x = -10;
				start.y = -10;
				start.isSet = false;
			}

			draw();
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

		const handleRightClick = event => {
			event.preventDefault();

			const rect = getRectAt(event.offsetX / canvas.width, event.offsetY / canvas.height);

			if (rect != null) {
				rects = rects.filter(r => r !== rect);
			}

			draw();
		};

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

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

				ctx.fillStyle = 'rgba(51, 153, 255, 0.8)';
				ctx.font = 'bold 16px Arial';
				ctx.fillText("Hallo", start.x * canvas.width, start.y * canvas.height - 5);

				ctx.beginPath();
				ctx.rect(start.x * canvas.width, start.y * canvas.height, (end.x - start.x) * canvas.width, (end.y - start.y) * canvas.height);
				ctx.fillStyle = 'rgba(51, 153, 255, 0.3)';
				ctx.fill();
			}

			ctx.beginPath();
			ctx.rect(start.x * canvas.width, start.y * canvas.height, (end.x - start.x) * canvas.width, (end.y - start.y) * canvas.height);
			ctx.fillStyle = 'rgba(51, 153, 255, 0.3)';
			ctx.fill();

			ctx.beginPath();
			ctx.rect(start.x * canvas.width - 5, start.y * canvas.height - 5, 10, 10);
			ctx.fillStyle = '#fff';
			ctx.strokestyle = '#000';
			ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.rect(end.x * canvas.width - 5, end.y * canvas.height - 5, 10, 10);
			ctx.fillStyle = '#fff';
			ctx.strokestyle = '#000';
			ctx.fill();
			ctx.stroke();
		};

		ctx.canvas.addEventListener('mousemove', handleMouseMove);
		ctx.canvas.addEventListener('click', handleClick);
		ctx.canvas.addEventListener('contextmenu', handleRightClick);

		(async () => {
			const response = await Database.getImage(token, imageId);

			if (response.success) {
				resizeCanvas();

				img.onload = () => {
					draw();
				};

				img.src = `http://localhost:5000/${response.image.filename}`;
			}
		})();

	}, [imageId, token]);

	return (
		<>
			<canvas className={classes.canvas} ref={canvasRef}></canvas>
		</>
	);

};

export default EditorPage;
