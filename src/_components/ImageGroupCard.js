import React from "react";

import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import ImageIcon from "@material-ui/icons/Image";
import GetAppIcon from "@material-ui/icons/GetApp";
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

	downloadAvatar: {
		background: "#222",
		color: "#fff"
	}
}));

const ImageGroupCard = ({
	downloadable,
	onDownload = () => {},
	src,
	title,
	subtitle,
	onClick,
	imageGroupId,
	...props
}) => {
	const classes = useStyles();

	const handleClickDownload = event => {
		event.stopPropagation();
		onDownload();
	};

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

				{downloadable ? (
					<CardContent>
						<Tooltip title="Export">
							<Fab
								size="small"
								onClick={handleClickDownload}
								className={classes.downloadAvatar}
							>
								<GetAppIcon />
							</Fab>
						</Tooltip>
					</CardContent>
				) : null}
			</Card>
		</div>
	);
};

export default ImageGroupCard;
