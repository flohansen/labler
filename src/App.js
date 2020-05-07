import React from 'react';
import './App.css';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	
	root: {
		display: 'flex'
	},

	appBar: {
		background: '#fff',
		borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
	},

	menuButton: {
		marginRight: theme.spacing(2)
	},

	appTitle: {
		color: theme.palette.text.primary
	}


}));

function App() {
	const classes = useStyles();

  return (
		<div className={classes.root}>
			<AppBar className={classes.appBar} elevation={0}>
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.appTitle}>
						Labler
					</Typography>
				</Toolbar>
			</AppBar>
		</div>
  );
}

export default App;
