import React, { useState } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import axios from 'axios';

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

const StyledWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const StyledVideoWrapper = styled.div`
	width: auto;
	height: 60%;
`;

const StyledButton = styled.button`
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
	font-size: 1.6rem;
	font-weight: 500;
	color: #dceefb;
	outline: none;
	border: none;
	transition: 0.2s ease-in;
	cursor: pointer;

	&:hover {
		background-color: #127fbf;
	}
`;

function RedEyeCheck() {
	const [img, setImg] = useState('');
	const videoConstraints = {
		width: 360,
		height: 360,
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
		<StyledWrapper>
			<StyledVideoWrapper>
				<Webcam
					audio={false}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
					style={{ borderRadius: '5px' }}
				/>
			</StyledVideoWrapper>
			<StyledButton onClick={capture}>Capture photo</StyledButton>
		</StyledWrapper>
	);
}

export default RedEyeCheck;
