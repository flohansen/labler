import React from "react";

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import ImageIcon from "@material-ui/icons/Image";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
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
	}
}));

const ImageGroupCard = ({
	onDownload,
	onDelete,
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
				<CardHeader
					subheaderTypographyProps={{ noWrap: true }}
					titleTypographyProps={{ noWrap: true }}
					title={title}
					subheader={subtitle}
				/>
				<CardActionArea onClick={onClick}>
					{src ? (
						<CardMedia image={src} className={classes.media} />
					) : (
						<div className={classes.defaultMedia}>
							<ImageIcon className={classes.defaultMediaIcon} />
						</div>
					)}
				</CardActionArea>

				<CardActions>
					{typeof onDownload === "function" ? (
						<Tooltip title="Export">
							<IconButton onClick={onDownload}>
								<GetAppIcon />
							</IconButton>
						</Tooltip>
					) : null}

					{typeof onDelete === "function" ? (
						<Tooltip title="Delete">
							<IconButton onClick={onDelete}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					) : null}
				</CardActions>
			</Card>
		</div>
	);
};

export default ImageGroupCard;
