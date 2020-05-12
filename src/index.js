import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import LoginPage from './_components/LoginPage';
import { AuthProvider } from './_contexts/AuthContext';
import * as serviceWorker from './serviceWorker';

const loggedIn = false;

ReactDOM.render(
  <React.StrictMode>
		<AuthProvider>
			<Router>
				<Switch>

					{ !loggedIn ? (
							<Redirect from="/app" to="login" />
						) : (
							null
						)
					}

					<Route path="/app">
						<App />
					</Route>
					<Route path="/login">
						<LoginPage />
					</Route>

					<Redirect from="/" to="app" />
				</Switch>
			</Router>
		</AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
