import React, { useState } from 'react';
import styled from 'styled-components';
// import FileUploadZone from './fileUpload';
// import { Popup, useOnClickOutside } from './popup';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Webcam from 'react-webcam';
const StyledHeader = styled.header`
	width: 100%;
	height: 100vh;
	/* background: linear-gradient(90deg, #0575e6, #1435b3); */
	background-color: #1f2933;
	/* clip-path: polygon(0 0, 100% 0%, 100% 88%, 0% 100%); */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;
const StyledHeading = styled.h1`
	margin: 0;
	padding: 0;
	font-size: 4.8rem;
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
const StyledButton = styled.a`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 48px;
	background-color: #1992d4;
	color: #fff;
	font-family: 'Inter';
	border-radius: 5px;
	text-decoration: none;
	margin-top: 24px;
	flex-direction: column;
	font-size: 2rem;
	font-weight: 500;
	transition: 0.2s ease-in;
	cursor: pointer;

	&:hover {
		background-color: #127fbf;
	}

	span:last-child {
		display: inline-block;
		margin-top: 8px;
		font-size: 1.4rem;
		font-weight: 400;
		color: #b6e0fe;
	}
`;

function createUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			let r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
}

const dataURLtoFile = (dataurl, filename) => {
	const arr = dataurl.split(',');
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n) {
		u8arr[n - 1] = bstr.charCodeAt(n - 1);
		n -= 1; // to make eslint happy
	}
	return new File([u8arr], filename, { type: mime });
};

const Header = () => {
	const [img, setImg] = useState('');
	const videoConstraints = {
		width: 400,
		height: 400,
		facingMode: 'user',
	};
	const webcamRef = React.useRef(null);

	const capture = React.useCallback(() => {
		const imageSrc = webcamRef.current.getScreenshot();
		const file = dataURLtoFile(imageSrc, `${createUUID()}.jpeg`);
		const data = new FormData();
		data.append('file', file, file.name);

		try {
			const fileUpload = axios
				.post('http://localhost:5000/predict', data, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					// the following response type is only when program has to receive byte-coded assets like images
					// responseType: 'arraybuffer',
				})
				.then((res) => {
					console.log(res.data);
					// let image = btoa(
					// 	new Uint8Array(res.data).reduce(
					// 		(data, byte) => data + String.fromCharCode(byte),
					// 		''
					// 	)
					// );
					// setImg(
					// 	`data:${res.headers[
					// 		'content-type'
					// 	].toLowerCase()};base64,${image}`
					// );
				});
		} catch (error) {
			console.log(error);
		}
	}, [webcamRef]);

	return (
		<StyledHeader>
			<StyledHeading>Check well being of your eyes</StyledHeading>
			<StyledSubHeading>
				Take a self-assessment of your eyes and scan for any symptoms of
				eye strain within 120 seconds
			</StyledSubHeading>
			<StyledButton href="/test">
				<span>Take a General Test</span>
				<span>It takes 2 minutes</span>
			</StyledButton>
			{/* <FileUploadZone /> */}
			{/* <Webcam
				audio={false}
				height={720}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				width={720}
				videoConstraints={videoConstraints}
			/>
			<button onClick={capture}>Capture photo</button> */}
		</StyledHeader>
	);
};

export default Header;
