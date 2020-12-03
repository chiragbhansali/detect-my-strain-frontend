import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';
import { Popup, useOnClickOutside } from './popup';
import '../styles/loaders.min.css';

const getColor = (props) => {
	if (props.isDragAccept) {
		return '#00e676';
	}
	if (props.isDragReject) {
		return '#ff1744';
	}
	if (props.isDragActive) {
		return '#2196f3';
	}
	return '#fafafa';
};

const StyledDropzone = styled.div`
	text-align: center;
	width: 500px;
	height: 220px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-color: #fafafa;
	border: 2px dashed ${(props) => getColor(props)};
	color: #bdbdbd;
	font-size: 1.6rem;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	margin-bottom: 20px;
	transition: 0.3s;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1), 0 10px 22px rgba(0, 0, 0, 0.2);
`;

const StyledBrowserChrome = styled.div`
	height: 12px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-color: #e8e8e8;
	padding: 12px;
`;

const StyledBrowserAction = styled.div`
	height: 12px;
	width: 12px;
	background: #ff5f56;
	box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
	border-radius: 50%;
`;

const StyledLoaderInner = styled.div`
	background-color: var(--primary) !important;

	&::before,
	&::after {
		background-color: var(--primary) !important;
	}
`;

const FileUploadZone = () => {
	const [fileNames, setFileNames] = useState([]);
	const [detectResultPopup, setDetectResultPopup] = useState(false);
	const detectResultPopupNode = useRef();
	useOnClickOutside(detectResultPopupNode, () => {
		setDetectResultPopup(false);
	});
	const [rejectedFileNames, setRejectedFileNames] = useState([]);
	const [mediaResult, setMediaResult] = useState('');
	const [loaderState, setLoaderState] = useState(false);
	const [dropText, setDropText] = useState(
		`Drag'n'drop files, or click to select files`
	);
	const [img, setImg] = useState('');
	const handleDrop = async (acceptedFiles) => {
		// setFileNames(acceptedFiles.map((file) => file.name));
		if (acceptedFiles) {
			const formData = new FormData();
			console.log(acceptedFiles[0]);
			setDropText(`Verifying ${acceptedFiles[0].name} ...`);
			formData.append('file', acceptedFiles[0]);
			setLoaderState(true);
			try {
				// http://detect-my-strain.herokuapp.com/crop
				// http://localhost:5000/crop
				const fileUploadRes = await axios
					.post('http://detect-my-strain.herokuapp.com/crop', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						responseType: 'arraybuffer',
					})
					.then((res) => {
						console.log(res);
						let image = btoa(
							new Uint8Array(res.data).reduce(
								(data, byte) =>
									data + String.fromCharCode(byte),
								''
							)
						);
						console.log(
							`data:${res.headers[
								'content-type'
							].toLowerCase()};base64,${image}`
						);
						setImg(
							`data:${res.headers[
								'content-type'
							].toLowerCase()};base64,${image}`
						);

						setLoaderState(false);
						setDropText(
							`Drag'n'drop files, or click to select files`
						);
					});
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div>
			<StyledBrowserChrome>
				<StyledBrowserAction />
			</StyledBrowserChrome>
			<Dropzone
				onDrop={handleDrop}
				maxFiles={1}
				maxSize={50 * 1024 * 1024}
				accept={[
					'image/jpeg',
					'image/png',
					'image/jpg',
					'image/webp',
					'video/mp4',
					'video/webm',
				]}
			>
				{({
					getRootProps,
					getInputProps,
					isDragActive,
					isDragAccept,
					isDragReject,
					fileRejections,
				}) => {
					return (
						<StyledDropzone
							{...getRootProps({
								className: 'dropzone',
								isDragActive: isDragActive,
								isDragReject: isDragReject,
								isDragAccept: isDragAccept,
							})}
						>
							<input {...getInputProps()} />
							<div
								className="ball-pulse"
								style={{
									display: loaderState ? 'block' : 'none',
									marginBottom: '20px',
								}}
							>
								<StyledLoaderInner></StyledLoaderInner>
								<StyledLoaderInner></StyledLoaderInner>
								<StyledLoaderInner></StyledLoaderInner>
							</div>
							<p>{dropText}</p>
						</StyledDropzone>
					);
				}}
			</Dropzone>
			<div>
				<strong>{mediaResult}</strong>
				<img
					src={`data:image/jpeg;base64${img}`}
					alt="Hello"
					id="testimg"
				/>
				{/* <ul>
					{fileNames.map((fileName) => (
						<li key={fileName}>{fileName}</li>
					))}
				</ul> */}
			</div>
			<Popup
				popupState={detectResultPopup}
				ref={detectResultPopupNode}
			></Popup>
		</div>
	);
};

export default FileUploadZone;
