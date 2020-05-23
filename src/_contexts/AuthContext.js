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
	const [payload, setPayload] = useState();

	useEffect(() => {
		const parts = token.split('.');

		if (parts.length === 3) {
			const payload = JSON.parse(atob(parts[1]));
			setPayload(payload);
		}
	}, [token]);

	return (
		<AuthContext.Provider value={{ token: [token, setToken], payload: [payload, setPayload] }}>
			{props.children}
		</AuthContext.Provider>
	);

};

export {
	AuthContext as default,
	AuthProvider
}
