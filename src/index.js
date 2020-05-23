import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import LoginPage from './_components/LoginPage';
import PrivateRoute from './_components/PrivateRoute';
import { AuthProvider } from './_contexts/AuthContext';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<AuthProvider>
		<Router>
			<Switch>
				<PrivateRoute path="/app" component={App} />

				<Route path="/login">
					<LoginPage />
				</Route>

				<Redirect from="/" to="app" />
			</Switch>
		</Router>
	</AuthProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
