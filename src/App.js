import React, { useState } from 'react';
import './App.css';

import ImageGroup from "./_components/ImageGroup";
import MediaGrid from "./_components/MediaGrid";
import HeadLine from "./_components/HeadLine";

import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
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

const imageGroups = [
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	},
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	},
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	},
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	},
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	},
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	},
	{
		title: 'Mobile Engineering',
		subtitle: 'Object Detection',
		image: 'sea.jpg'
	}
];

function App() {
	const classes = useStyles();

	const [addGroupOpen, setAddGroupOpen] = useState(false);

	const handleAddGroupClick = () => {
		setAddGroupOpen(true);
	};

	const handleAddGroupClose = () => {
		setAddGroupOpen(false);
	};

	const handleAddGroupCreate = () => {
		setAddGroupOpen(false);
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
				</Toolbar>
			</AppBar>
			<main className={classes.content}>

				<HeadLine title="Image groups">
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddGroupClick}
					>
						New Group
					</Button>
				</HeadLine>

				<MediaGrid>
					{ imageGroups.map(item => (
						<ImageGroup
							title={item.title}
							subtitle={item.subtitle} />
					)) }
				</MediaGrid>
			</main>

			<Dialog open={addGroupOpen} onClose={handleAddGroupClose}>
				<DialogTitle>Create new image group</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please fill out the form to create a new image group.
					</DialogContentText>
					<TextField label="Group name" fullWidth margin="dense" autoFocus />
					<TextField label="Group type" fullWidth margin="dense" />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleAddGroupClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleAddGroupCreate} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</div>
  );
}

export default App;
