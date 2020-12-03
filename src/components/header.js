import React, { useState, useRef } from 'react';
import styled from 'styled-components';
// import FileUploadZone from './fileUpload';
// import { Popup, useOnClickOutside } from './popup';
import RecordRTC from 'recordrtc';
import axios from 'axios';
import Webcam from 'react-webcam';
import { ReactComponent as EyeCheckIcon } from '../assets/eye.svg';
const StyledHeader = styled.header`
	width: 100%;
	height: 100vh;
	/* background: linear-gradient(90deg, #0575e6, #1435b3); */
	background-color: #1a1a2e;
	/* background-color: #212121; */
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
		// console.log(imageSrc);
		const file = dataURLtoFile(imageSrc, `${createUUID()}.jpeg`);
		const data = new FormData();
		data.append('file', file, file.name);
		console.log(file);

		try {
			const fileUpload = axios
				.post('http://localhost:5000/testmodel', data, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					responseType: 'arraybuffer',
				})
				.then((res) => {
					console.log(res);
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
			<EyeCheckIcon />
			<StyledHeading>iStrain</StyledHeading>
			<StyledSubHeading>
				Take a self-assessment of your eyes and scan for any symptoms of
				eye strain within 90 seconds
			</StyledSubHeading>
			{/* <FileUploadZone /> */}
			<Webcam
				audio={false}
				height={720}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				width={720}
				videoConstraints={videoConstraints}
			/>
			<button onClick={capture}>Capture photo</button>
			<img src={img} alt="" />
		</StyledHeader>
	);
};

export default Header;
