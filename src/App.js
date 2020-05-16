import React, { useContext } from 'react';
import './App.css';

import { CategoryProvider } from "./_contexts/CategoryContext";
import AuthContext from "./_contexts/AuthContext";
import { ImageGroupProvider } from "./_contexts/ImageGroupContext";
import ImageGroupListPage from "./_components/ImageGroupListPage";

import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
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
		color: theme.palette.text.primary,
		flexGrow: 1
	},

	avatarName: {
		color: theme.palette.text.primary,
		marginRight: theme.spacing(1)
	},

	avatarButton: {
		marginRight: theme.spacing(3)
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
	const { payload: [payload,], token: [, setToken] } = useContext(AuthContext);
	const classes = useStyles();

	const handleLogoutClick = () => {
		setToken('null');
	};

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

					<Typography variant="overline" className={classes.avatarName}>
						{payload?.username}
					</Typography>
					<IconButton className={classes.avatarButton}>
						<Avatar>
							{payload?.username?.charAt(0).toUpperCase()}
						</Avatar>
					</IconButton>
					<Button size="small" onClick={handleLogoutClick}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>

			<main className={classes.content}>
				<ImageGroupProvider>
					<CategoryProvider>
						<ImageGroupListPage />
					</CategoryProvider>
				</ImageGroupProvider>
			</main>
		</div>
  );
}

export default App;
