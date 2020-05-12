import React from 'react';
import './App.css';

import { ImageGroupProvider } from "./_contexts/ImageGroupContext";
import ImageGroupListPage from "./_components/ImageGroupListPage";

import CssBaseline from "@material-ui/core/CssBaseline";
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
	},

	content: {
		minHeight: 'calc(100vh - 64px)',
		background: '#f9f9f9',
		marginTop: '64px',
		flexGrow: 1,
		padding: theme.spacing(3)
	}

}));

function App() {
	const classes = useStyles();

  return (
		<div className={classes.root}>
			<CssBaseline />
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

			<main className={classes.content}>
				<ImageGroupProvider>
					<ImageGroupListPage />
				</ImageGroupProvider>
			</main>
		</div>
  );
}

export default App;
