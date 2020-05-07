import React from "react";
import waves from "../_icons/waves.svg";

import CssBaseline from "@material-ui/core/CssBaseline";
import SvgIcon from "@material-ui/core/SvgIcon";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({

	root: {
		display: 'flex',
		flexDirection: 'column',
		width: '100vw',
		height: '100vh',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#7586A0'
	},
	
	waves: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: '60%',
		maxHeight: '50%',
		objectFit: 'cover',
		objectPosition: '50% 0',
		zIndex: 0
	},

	appInfo: {
		marginBottom: theme.spacing(8)
	},

	appName: {
		color: theme.palette.primary.contrastText,
		opacity: 0.87
	},

	appDescription: {
		color: theme.palette.primary.contrastText,
		opacity: 0.3
	},

	card: {
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		minWidth: 400,
		zIndex: 1
	},

	cardContent: {
		display: 'flex',
		flexDirection: 'column',

		"& > *": {
			marginBottom: theme.spacing(4)
		},

		"& > *:last-child": {
			marginBottom: 0
		}
	}

}));

const LoginPage = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<CssBaseline />

			<img
				className={classes.waves}
				src={waves}
				alt=""
			/>

			<div className={classes.appInfo}>
				<Typography
					variant="h2"
					align="center"
					className={classes.appName}
				>
					Labler
				</Typography>
				<Typography
					variant="h6"
					align="center"
					className={classes.appDescription}
				>
					Label your images
				</Typography>
			</div>

			<Card className={classes.card}>
				<CardHeader title="Login" />
				<CardContent className={classes.cardContent}>
					<TextField
						label="Username"
						variant="outlined"
						size="small"
					/>
					<TextField
						label="Password"
						variant="outlined"
						size="small"
						type="password"
					/>
					<Button color="primary" variant="contained">Login</Button>
				</CardContent>
			</Card>
		</div>
	);

};

export default LoginPage;
