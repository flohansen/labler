import React, { useContext } from "react";
import { Redirect, Route } from 'react-router-dom';
import AuthContext from "../_contexts/AuthContext";

function PrivateRoute({ component: Component, ...rest }) {

	const { token: [token,] } = useContext(AuthContext);

  return (
		<Route {...rest} render={props =>
				token !== 'null' && token !== null ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
				)
			}
		/>
  );

}

export default PrivateRoute;
