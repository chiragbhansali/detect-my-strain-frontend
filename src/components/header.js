import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import FileUploadZone from './fileUpload';
import axios from 'axios';
import { Popup, useOnClickOutside } from './popup';

const StyledHeader = styled.header`
	width: 100%;
	height: 100vh;
	background: linear-gradient(90deg, #0575e6, #1435b3);
	/* clip-path: polygon(0 0, 100% 0%, 100% 88%, 0% 100%); */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
const StyledHeading = styled.h1`
	margin: 0;
	padding: 0;
	font-size: 4rem;
	margin-bottom: 24px;
	color: #fff;
`;
const StyledSubHeading = styled.h2`
	margin: 0;
	padding: 0;
	font-size: 2rem;
	font-weight: 500;
	color: #fff;
	margin-bottom: 40px;
`;

const Header = () => {
	return (
		<StyledHeader>
			<StyledHeading>Detect Fake Images and Videos</StyledHeading>
			<StyledSubHeading>
				Fight misinformation by instantly finding identifying fake
				images and videos
			</StyledSubHeading>
			<FileUploadZone />
		</StyledHeader>
	);
};

export default Header;
