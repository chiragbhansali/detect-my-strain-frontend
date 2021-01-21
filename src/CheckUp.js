import React from 'react';
import styled from 'styled-components';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import 'react-awesome-slider/dist/custom-animations/scale-out-animation.css';
import 'react-awesome-slider/dist/custom-animations/fold-out-animation.css';
// import RedEyeCheck from './components/redEyeCheck';
import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { css } from '@emotion/core';
import BarLoader from 'react-spinners/BarLoader';
import { ReactComponent as CameraIcon } from './assets/camera.svg';

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

let eyeStrainVerdict = 1;

const CheckIcon = () => {
	return (
		<svg
			width="144"
			height="144"
			viewBox="0 0 144 144"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M72 132C105.137 132 132 105.137 132 72C132 38.8629 105.137 12 72 12C38.8629 12 12 38.8629 12 72C12 105.137 38.8629 132 72 132Z"
				fill="#4CAF50"
			/>
			<path
				d="M66.9997 93.1178C65.2717 93.1178 63.5437 92.4578 62.2267 91.1408L43.9778 72.8888C41.3408 70.2548 41.3408 65.9798 43.9778 63.3428C46.6118 60.7058 50.8898 60.7058 53.5238 63.3428L71.7728 81.5948C74.4098 84.2288 74.4098 88.5038 71.7728 91.1408C70.4558 92.4578 68.7277 93.1178 66.9997 93.1178Z"
				fill="white"
			/>
			<path
				d="M66.9998 93.1178C65.2718 93.1178 63.5438 92.4577 62.2268 91.1408C59.5898 88.5067 59.5898 84.2318 62.2268 81.5948L90.8438 52.9777C93.4778 50.3408 97.7558 50.3408 100.39 52.9777C103.027 55.6117 103.027 59.8868 100.39 62.5238L71.7728 91.1408C70.4558 92.4577 68.7278 93.1178 66.9998 93.1178Z"
				fill="white"
			/>
		</svg>
	);
};
const AlertIcon = () => {
	return (
		<svg
			width="144"
			height="144"
			viewBox="0 0 144 144"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M63.6 134.4L9.6 80.4C4.8 75.6 4.8 68.1 9.6 63.3L63.6 9.30001C68.4 4.50001 75.9 4.50001 80.7 9.30001L134.7 63.3C139.5 68.1 139.5 75.6 134.7 80.4L80.7 134.4C75.9 139.2 68.1 139.2 63.6 134.4Z"
				fill="#F44336"
			/>
			<path
				d="M64.7998 98.1C64.7998 97.2 65.0998 96.3 65.3998 95.4C65.6998 94.5 66.2998 93.9 66.8998 93.3C67.4998 92.7 68.3998 92.1 69.2998 91.8C70.1998 91.5 71.0998 91.2 72.2998 91.2C73.4998 91.2 74.3998 91.5 75.2998 91.8C76.1998 92.1 77.0998 92.7 77.6998 93.3C78.2998 93.9 78.8998 94.5 79.1998 95.4C79.4998 96.3 79.7998 97.2 79.7998 98.1C79.7998 99 79.4998 99.9 79.1998 100.8C78.8998 101.7 78.2998 102.3 77.6998 102.9C77.0998 103.5 76.1998 104.1 75.2998 104.4C74.3998 104.7 73.4998 105 72.2998 105C71.0998 105 70.1998 104.7 69.2998 104.4C68.3998 104.1 67.7998 103.5 66.8998 102.9C66.2998 102.3 65.6998 101.7 65.3998 100.8C65.0998 99.9 64.7998 99.3 64.7998 98.1ZM77.3998 84.3H66.5998L65.0998 39H78.8998L77.3998 84.3Z"
				fill="white"
			/>
		</svg>
	);
};

const StyledWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const StyledAwesomeSlider = styled(AwesomeSlider)`
	min-height: 64vh;
	width: 60vw;
	margin-top: 40px;
	background-color: var(--bg);

	.awssld__content {
		background-color: var(--bg);
		align-items: flex-start;
	}

	.awssld__container {
		height: 100%;
	}
`;

const StyledProgressBar = styled.div`
	width: 400px;
	height: 12px;
	border-radius: 10px;
	margin-top: 100px;
	background-color: #3e4c59;
	z-index: 2;

	div {
		height: 12px;
		width: 0;
		border-radius: 10px;
		background-color: #127fbf;
	}
`;

const StyledQuestion = styled.h1`
	color: #fff;
	font-size: 3rem;
	font-weight: 600;
	text-align: center;
	margin-bottom: 40px;
`;

const StyledBasicWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 100%;
`;
const StyledOptionWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const StyledOption = styled.label`
	margin-bottom: 20px;
	outline: none;
	cursor: pointer;
	span {
		width: 360px;
		height: 60px;
		border-radius: 5px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: #3e4c59;
		font-size: 1.6rem;
		font-weight: 500;
		color: #ffffff;
		border: 5px solid transparent;
		outline: none;
		transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
	}
`;

const StyledRadio = styled.input`
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
	outline: 0;
	outline: none;

	&:checked + span {
		/* border-color: #1992d4; */
		background-color: #127fbf;
		background-color: #14919b;
	}
`;

// Red Eye Check Up Code Styles

const StyledRedEyeWrapper = styled.div`
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
const StyledLinkButton = styled.a`
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
	text-decoration: none;
	transition: 0.2s ease-in;
	cursor: pointer;

	&:hover {
		background-color: #127fbf;
	}
`;

const StyledMessageHeading = styled.h1`
	font-size: 3rem;
	font-weight: 700;
	text-align: center;
	color: #ffffff;
`;
const StyledMessageText = styled.p`
	font-size: 1.6rem;
	width: 400px;
	line-height: 150%;
	font-weight: 500;
	text-align: center;
	color: #ffffff;
`;

function CheckUp() {
	const [sliderSelected, setSliderSelected] = useState(0);
	const [data, setData] = useState({
		q1: 0,
		q2: 0,
		q3: 0,
		q4: 0,
		redEye: 0,
	});

	const Question = ({ question, index }) => {
		const Option = ({ optionValue }) => {
			let optId =
				optionValue.charAt(0).toLowerCase() + optionValue.slice(1);
			optId = optId.replace(/\s+/g, '').toLowerCase();

			function handleOptionClick(value) {
				setSliderSelected(sliderSelected + 1);

				if (value === 'Yes') {
					setData({ ...data, [`q${index}`]: 1 });
				} else if (value === 'No') {
					setData({ ...data, [`q${index}`]: -1 });
				} else {
					setData({ ...data, [`q${index}`]: 0 });
				}
				console.log();
			}

			return (
				<StyledOption
					htmlFor={`${optId}${index}`}
					onClick={() => handleOptionClick(optionValue)}
					role="button"
					tabIndex="0"
				>
					<StyledRadio
						type="radio"
						name={`${index}`}
						id={`${optId}${index}`}
					/>
					<span>{optionValue}</span>
				</StyledOption>
			);
		};
		return (
			<div>
				<StyledQuestion>{question}</StyledQuestion>
				<StyledOptionWrapper>
					<Option optionValue="Yes" />
					<Option optionValue="No" />
					<Option optionValue="Not Sure" />
				</StyledOptionWrapper>
			</div>
		);
	};

	const [isLoading, setIsLoading] = useState(true);
	const [showProgressBar, setShowProgressBar] = useState('block');

	function RedEyeCheck() {
		const [img, setImg] = useState('');
		const videoConstraints = {
			width: 360,
			height: 360,
			facingMode: 'user',
		};
		const webcamRef = React.useRef(null);

		const capture = React.useCallback(() => {
			setSliderSelected(sliderSelected + 1);
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
						eyeStrainVerdict = res.data.result.verdict;
						setIsLoading(false);
						console.log(sliderSelected);
						setSliderSelected(7);
						console.log(sliderSelected);
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
			<StyledRedEyeWrapper>
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
			</StyledRedEyeWrapper>
		);
	}

	const override = css`
		display: block;
		margin: 0 auto;
		border-color: red;
		margin-top: 5;
	`;

	// useEffect(() => {
	// 	if (sliderSelected === 6) {
	// 		console.log('Slider Started');
	// 		setShowProgressBar('None');
	// 		// setTimeout(() => {
	// 		// 	setIsLoading(false);
	// 		// 	setSliderSelected(sliderSelected + 1);
	// 		// }, 20000);
	// 	}
	// }, [sliderSelected]);

	return (
		<StyledWrapper>
			<StyledProgressBar style={{ display: `${showProgressBar}` }}>
				<div style={{ width: `${(sliderSelected * 400) / 6}px` }}></div>
			</StyledProgressBar>
			<StyledAwesomeSlider
				bullets={false}
				organicArrows={false}
				animation="foldOutAnimation"
				selected={sliderSelected}
			>
				<StyledBasicWrapper>
					<StyledBasicWrapper>
						<CameraIcon style={{ width: '80px', height: '80px' }} />
					</StyledBasicWrapper>
					<StyledMessageHeading>
						Attention Please
					</StyledMessageHeading>
					<StyledMessageText>
						To calculate blinking rate, predict red eyes and
						determine occurences of eyelid twitching, we need access
						to the device's camera for
					</StyledMessageText>
					<StyledBasicWrapper>
						<StyledLinkButton
							onClick={() =>
								setSliderSelected(sliderSelected + 1)
							}
						>
							Continue
						</StyledLinkButton>
					</StyledBasicWrapper>
				</StyledBasicWrapper>
				<div>
					<RedEyeCheck />
				</div>
				<div>
					<Question question="Are your eyes burning?" index={1} />
				</div>
				<div>
					<Question question="Are you having a headache?" index={2} />
				</div>
				<div>
					<Question
						question="Are you having blurred or double vision?"
						index={3}
					/>
				</div>
				<div>
					<Question
						question="Do you have neck or shoulder pain?"
						index={4}
					/>
				</div>
				<StyledBasicWrapper>
					<BarLoader
						css={override}
						size={150}
						color={'#127fbf'}
						loading={isLoading}
					/>
				</StyledBasicWrapper>
				<StyledBasicWrapper>
					<StyledBasicWrapper>
						{eyeStrainVerdict ? <AlertIcon /> : <CheckIcon />}
					</StyledBasicWrapper>
					<StyledMessageHeading>
						{eyeStrainVerdict ? 'High' : 'Low'}
					</StyledMessageHeading>
					<StyledMessageText>
						{eyeStrainVerdict
							? 'Alert! There is a high probability that you have eye strain. Wash your eyes, take breaks from electronic screens and take care!'
							: 'Congratulations! There is a very low probability that you have eye strain. Take care'}
						{eyeStrainVerdict ? null : (
							<span role="img" aria-label="Thumbs Up">
								👍
							</span>
						)}
					</StyledMessageText>
					<StyledBasicWrapper>
						<StyledLinkButton href="/">
							{' '}
							Back to Home
						</StyledLinkButton>
					</StyledBasicWrapper>
				</StyledBasicWrapper>
			</StyledAwesomeSlider>
		</StyledWrapper>
	);
}

export default CheckUp;
