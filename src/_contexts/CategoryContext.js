import React, { useContext, useCallback, useState, useEffect, createContext } from "react";

import AuthContext from "./AuthContext";
import Database from "../_services/Database";

const CategoryContext = createContext();

const CategoryProvider = ({ ...props }) => {

	const { token: [token,] } = useContext(AuthContext);
	const [categories, setCategories] = useState([]);

	const updateCategories = useCallback(() => {
		const response = await Database.getCategories(token);

		if (response.success) {
			setCategories(response.categories);
		}
	}, [token]);

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
