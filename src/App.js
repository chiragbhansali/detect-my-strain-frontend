import React from 'react';
import './App.css';
import Header from './components/header';
import Nav from './components/nav';

function App() {
	return (
		<>
			<div id="popupContainer"></div>
			<div className="App">
				<Nav />
				<Header />
			</div>
		</>
	);
}

export default App;
