import React from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({

	header: {
		display: 'flex',
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(5),
		paddingBottom: theme.spacing(1),
		borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
	},

	headerActions: {
		marginLeft: 'auto'
	}

}));

const HeadLine = ({ title, ...props }) => {
	const classes = useStyles();

	return (
		<div className={classes.header}>
			<Typography variant="h6">
				{title}
			</Typography>

			<div className={classes.headerActions}>
				{props.children}
			</div>
		</div>
	);

};

export default HeadLine;
