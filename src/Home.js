import React from 'react';
import './Home.css';
import Header from './components/header';

function Home() {
	return (
		<>
			<div id="popupContainer"></div>
			<div className="Home">
				<Header />
			</div>
		</>
	);
}

export default Home;
