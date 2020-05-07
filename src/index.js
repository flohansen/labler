import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import LoginPage from './_components/LoginPage';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
		<Router>
			<Switch>
				<Route path="/app">
					<App />
				</Route>
				<Route path="/login">
					<LoginPage />
				</Route>
			</Switch>
		</Router>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
