import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Home from './Home';
import CheckUp from './CheckUp';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Nav from './components/nav';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Nav />
			<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/test" component={CheckUp} />
			</Switch>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
