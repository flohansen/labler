import React, { useEffect, useContext, useCallback, useState, createContext } from "react";

import AuthContext from "./AuthContext";
import Database from "../_services/Database";

const CategoryContext = createContext();

const CategoryProvider = ({ ...props }) => {

	const { token: [token,] } = useContext(AuthContext);
	const [categories, setCategories] = useState([]);

	const updateCategories = useCallback(async () => {
		const response = await Database.getCategories(token);

		if (response.success) {
			setCategories(response.categories);
		}
	}, [token]);

	useEffect(() => {
		updateCategories();
	}, [updateCategories]);

	return (
		<CategoryContext.Provider value={[categories, updateCategories]}>
			{props.children}
		</CategoryContext.Provider>
	);

};

export {
	CategoryContext as default,
	CategoryProvider
}
