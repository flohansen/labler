import React from "react";

import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import DoneIcon from "@material-ui/icons/Done";
import ImageIcon from "@material-ui/icons/Image";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	media: {
		height: 0,
		paddingTop: "56.25%"
	},

	defaultMedia: {
		position: "relative",
		height: 0,
		paddingTop: "56.25%",
		background: "#e4e4e4",
		display: "flex",
		justifyContent: "center"
	},

	defaultMediaIcon: {
		position: "absolute",
		width: 64,
		height: 64,
		fill: "#aaa",
		top: "50%",
		transform: "translateY(-50%)"
	},

	doneAvatar: {
		position: "absolute",
		right: 0,
		top: 0,
		margin: 16,
		background: "#4aba5d",
		width: 32,
		height: 32
	}
}));

const ImageGroup = ({
	checked,
	src,
	title,
	subtitle,
	onClick,
	imageGroupId,
	...props
}) => {
	const classes = useStyles();

	return (
		<div {...props}>
			<Card className={classes.card}>
				<CardActionArea onClick={onClick}>
					{checked ? (
						<Avatar className={classes.doneAvatar}>
							<DoneIcon />
						</Avatar>
					) : null}

					{src ? (
						<CardMedia image={src} className={classes.media} />
					) : (
						<div className={classes.defaultMedia}>
							<ImageIcon className={classes.defaultMediaIcon} />
						</div>
					)}
					<CardHeader title={title} subheader={subtitle} />
				</CardActionArea>
			</Card>
		</div>
	);
};

export default ImageGroup;
