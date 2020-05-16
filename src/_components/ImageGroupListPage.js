import React, { useState, useContext } from 'react';

import AuthContext from "../_contexts/AuthContext";
import CategoryContext from "../_contexts/CategoryContext";
import ImageGroupContext from "../_contexts/ImageGroupContext";
import Database from "../_services/Database";
import MediaGrid from "./MediaGrid";
import HeadLine from "./HeadLine";
import ImageGroup from "./ImageGroup";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const ImageGroupListPage = () => {
	const [categories,] = useContext(CategoryContext);
	const { token: [token,] } = useContext(AuthContext);
	const [imageGroups, updateImageGroups] = useContext(ImageGroupContext);
	const [addGroupOpen, setAddGroupOpen] = useState(false);
	const [newGroupName, setNewGroupName] = useState('');
	const [newGroupType, setNewGroupType] = useState('');

	const handleAddGroupClose = () => {
		setAddGroupOpen(false);
	};

	const handleAddGroupCreate = async () => {
		const response = await Database.createImageGroup(token, newGroupName, newGroupType);
		setAddGroupOpen(false);
		
		if (response.success) {
			updateImageGroups();
		}
	};

	const handleAddGroupClick = () => {
		setAddGroupOpen(true);
	};

	const handleNewGroupNameChange = event => {
		setNewGroupName(event.currentTarget.value);
	};

	const handleNewGroupTypeChange = event => {
		setNewGroupType(event.target.value);
	};

	return (
		<>
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
				{ imageGroups.map((item, idx) => {
					const category= categories.find(cat => cat.id === item.categoryid);

					return (
						<ImageGroup
							key={idx}
							title={item.name}
							subtitle={category.name} />
					);
				}) }
			</MediaGrid>

			<Dialog open={addGroupOpen} onClose={handleAddGroupClose}>
				<DialogTitle>Create new image group</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please fill out the form to create a new image group.
					</DialogContentText>
					<TextField
						onChange={handleNewGroupNameChange}
						label="Group name"
						fullWidth
						margin="dense"
						autoFocus
					/>
					<FormControl fullWidth>
						<InputLabel id="new-group-category-label">Category</InputLabel>
						<Select
							labelId="new-group-category-label"
							value={newGroupType} 
							onChange={handleNewGroupTypeChange}
						>
							{ categories.map(cat => (
								<MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
							)) }
						</Select>
					</FormControl>
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
		</>
	);

};

export default ImageGroupListPage;
