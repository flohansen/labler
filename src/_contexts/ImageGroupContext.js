import React, { useEffect, useState, useCallback, useContext, createContext } from "react";
import Database from "../_services/Database";
import AuthContext from "./AuthContext";

const ImageGroupContext = createContext();

const ImageGroupProvider = ({ ...props }) => {

	const { token: [token,] } = useContext(AuthContext);
	const [imageGroups, setImageGroups] = useState([]);

	const updateImageGroups = useCallback(async () => {
		const response = await Database.getImageGroups(token);
		setImageGroups(response.groups);
	}, [token]);

	useEffect(() => {
		updateImageGroups();
	}, [token, updateImageGroups]);

	return (
		<ImageGroupContext.Provider value={[imageGroups, updateImageGroups]}>
			{props.children}
		</ImageGroupContext.Provider>
	);

};

export {
	ImageGroupContext as default,
	ImageGroupProvider
}
