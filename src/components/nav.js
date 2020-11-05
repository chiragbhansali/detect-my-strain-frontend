import React from 'react';
import styled from 'styled-components';
import logo from '../logo.svg';

const StyledNav = styled.nav`
	width: 100vw;
	height: 100px;
	position: fixed;
	top: 0;
	padding: 0 10vw;
	font-size: 1.6rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: transparent;
	color: #ffffff;
`;

const StyledLogo = styled.a`
	color: #ffffff;
	text-decoration: none;
	font-size: 2rem;
	font-weight: 700;
	display: flex;
	align-items: center;

	img {
		margin-right: 10px;
	}

	&:visited,
	&:link {
		color: #ffffff;
	}
`;

const StyledLinksContainer = styled.div``;
const StyledLink = styled.a`
	color: #ffffff;
	text-decoration: none;
	font-size: 1.6rem;
	font-weight: 500;
	margin-right: 36px;

	&:visited,
	&:link {
		color: #ffffff;
	}
`;

const Nav = () => {
	return (
		<StyledNav>
			<StyledLogo href="#">
				<img src={logo} alt="Deep Detect" />
				<span>Deep Detect</span>
			</StyledLogo>
			<StyledLinksContainer>
				<StyledLink href="#about">About</StyledLink>
				<StyledLink href="#app">Download App</StyledLink>
			</StyledLinksContainer>
		</StyledNav>
	);
};

export default Nav;