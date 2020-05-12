import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const useStateLocalStorage = key => {

	const [value, setValue] = useState(
		localStorage.getItem(key)
	);

	useEffect(() => {
		localStorage.setItem(key, value);
	}, [key, value]);

	return [value, setValue];
};

const AuthProvider = ({ ...props }) => {

	const [token, setToken] = useStateLocalStorage('auth_id');

	return (
		<AuthContext.Provider value={[token, setToken]}>
			{props.children}
		</AuthContext.Provider>
	);

};

export {
	AuthContext as default,
	AuthProvider
}
