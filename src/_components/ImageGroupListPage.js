import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import AuthContext from "../_contexts/AuthContext";
import CategoryContext from "../_contexts/CategoryContext";
import ImageGroupContext from "../_contexts/ImageGroupContext";
import Database from "../_services/Database";
import MediaGrid from "./MediaGrid";
import HeadLine from "./HeadLine";
import ImageGroupCard from "./ImageGroupCard";
import ConfirmDialog from "./ConfirmDialog";

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
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  inputCategory: {
    marginTop: theme.spacing(3)
  }
}));

const ImageGroupListPage = () => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [categories] = useContext(CategoryContext);
  const {
    token: [token]
  } = useContext(AuthContext);
  const [imageGroups, updateImageGroups] = useContext(ImageGroupContext);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  const [confirmDialogValue, setConfirmDialogValue] = useState();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupType, setNewGroupType] = useState("");
  const history = useHistory();

  const handleDeleteImageGroup = async () => {
    const response = await Database.deleteImageGroup(token, confirmDialogValue);

    if (response.success) {
      updateImageGroups();
      enqueueSnackbar("Deleted image group", { variant: "success" });
    } else {
      enqueueSnackbar("Could not delete image group", {
        variant: "error"
      });
    }
  };

  const handleOpenConfirmDialog = value => {
    setConfirmDialogValue(value);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogValue();
    setConfirmDialogOpen(false);
  };

  const handleConfirmDialogYes = () => {
    handleDeleteImageGroup();
    handleCloseConfirmDialog();
  };

  const handleConfirmDialogNo = () => {
    handleCloseConfirmDialog();
  };

  const handleAddGroupClose = () => {
    setAddGroupOpen(false);
  };

  const handleAddGroupCreate = async () => {
    const response = await Database.createImageGroup(
      token,
      newGroupName,
      newGroupType
    );
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

  useEffect(() => {
    setNewGroupType(categories[0]?.id);
  }, [categories]);

  return (
    <>
      <HeadLine title="Your image groups">
        <Button
          size="small"
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={handleAddGroupClick}
        >
          Group
        </Button>
      </HeadLine>

      <MediaGrid>
        {imageGroups.map((item, idx) => {
          const category = categories.find(cat => cat.id === item.categoryid);

          const handleGroupClick = () => {
            history.push(`/app/imageGroups/${item.id}`);
          };

          const handleDownload = async () => {
            const request = await fetch(
              `https://volbyte.com:5000/endpoint/imageGroups/${item.id}/export`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            const blob = await request.blob();
            const file = await window.URL.createObjectURL(blob);
            window.location.assign(file);
          };

          return (
            <ImageGroupCard
              onDownload={handleDownload}
              onDelete={() => handleOpenConfirmDialog(item.id)}
              src={
                item.thumbnail
                  ? `https://volbyte.com:5000/${item.thumbnail}`
                  : null
              }
              onClick={handleGroupClick}
              key={idx}
              title={item.name}
              subtitle={category?.name}
              imageGroupId={item.id}
            />
          );
        })}
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
          <FormControl className={classes.inputCategory} fullWidth>
            <InputLabel id="new-group-category-label">Category</InputLabel>
            <Select
              labelId="new-group-category-label"
              value={newGroupType}
              onChange={handleNewGroupTypeChange}
            >
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
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

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onYes={handleConfirmDialogYes}
        onNo={handleConfirmDialogNo}
        title="Do you really want to delete it?"
      ></ConfirmDialog>
    </>
  );
};

export default ImageGroupListPage;
