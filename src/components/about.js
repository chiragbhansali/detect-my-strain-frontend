import React from 'react';
import styled from 'styled-components';

const StyledAbout = styled.div`
	max-width: 100%;
	width: 100vw;
	height: 100vh;
	padding: 30px;
`;

const About = () => {
	return (
		<StyledAbout>
			Hello <div></div>
		</StyledAbout>
	);
};
export default About;
