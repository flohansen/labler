import React from "react";
import { useHistory } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({

	media: {
		height: 0,
		paddingTop: '56.25%'
	}

})); 

const ImageGroup = ({ title, subtitle, imageGroupId, ...props }) => {
	const classes = useStyles();
	const history = useHistory();

	const handleClick = () => {
		history.push(`/app/imageGroups/${imageGroupId}`);
	};

	return (
		<div {...props}>
			<Card className={classes.card}>
				<CardActionArea onClick={handleClick}>
					<CardMedia image="sea.jpg" className={classes.media} />
					<CardHeader title={title} subheader={subtitle} />
				</CardActionArea>
			</Card>
		</div>
	);

};

export default ImageGroup;
