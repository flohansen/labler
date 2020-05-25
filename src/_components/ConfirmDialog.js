import React from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const ConfirmDialog = ({
	onNo = () => {},
	onYes = () => {},
	title,
	...props
}) => {
	return (
		<Dialog {...props}>
			<DialogTitle>{title}</DialogTitle>

			{props.children}

			<DialogActions>
				<Button onClick={onNo} color="primary">
					No
				</Button>
				<Button onClick={onYes} color="primary">
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
