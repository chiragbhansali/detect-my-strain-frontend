import React, { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

function ClientOnlyPortal({ children, selector }) {
	const ref = useRef();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		ref.current = document.querySelector(selector);
		setMounted(true);
	}, [selector]);

	return mounted ? createPortal(children, ref.current) : null;
}

function useOnClickOutside(ref, handler) {
	const escapeListener = useCallback(
		(e) => {
			if (e.key === 'Escape') {
				handler(e);
			}
		},
		[handler]
	);
	useEffect(
		() => {
			const listener = (event) => {
				// Do nothing if clicking ref's element or descendent elements
				if (!ref.current || ref.current.contains(event.target)) {
					return;
				}

				handler(event);
			};

			document.addEventListener('mousedown', listener);
			document.addEventListener('touchstart', listener);
			document.addEventListener('keyup', escapeListener);

			return () => {
				document.removeEventListener('mousedown', listener);
				document.removeEventListener('touchstart', listener);
				document.removeEventListener('keyup', escapeListener);
			};
		},
		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
		[ref, handler, escapeListener]
	);
}

const StyledPopupOverlay = styled.div`
	z-index: 2;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.4);
	display: ${(props) => (props.open ? 'block' : 'none')};
	opacity: ${(props) => (props.open ? 1 : 0)};
	transition: opacity 0.3s cubic-bezier(0.76, 0, 0.24, 1),
		display 0.3s 0.5s ease-in;
`;

const StyledPopup = styled.div`
	min-height: 40vh;
	width: 75vw;
	position: fixed;
	top: 50vh;
	left: 50vw;
	transform: translate(-50%, -50%) scale(${(props) => (props.open ? 1 : 0)});
	background-color: #fff;
	color: #1f2933;
	padding: 40px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
	z-index: 4;
	border-radius: 10px;
	display: flex;
	opacity: ${(props) => (props.open ? 1 : 0)};
	transition: 0.3s cubic-bezier(0.76, 0, 0.24, 1);
`;

const StyledPopupHeading = styled.h1`
	font-size: 3.2rem;
	margin-bottom: 40px;
	color: #323f4b;
	text-align: center;
`;

// eslint-disable-next-line no-undef
const Popup = React.forwardRef((props, ref) => {
	const { children, heading, popupState, className, ...others } = props;

	return (
		<ClientOnlyPortal selector="#popupContainer">
			<StyledPopupOverlay open={popupState} />
			<StyledPopup open={popupState} ref={ref} {...others}>
				{heading ? (
					<StyledPopupHeading>{heading}</StyledPopupHeading>
				) : null}
				{children}
			</StyledPopup>
		</ClientOnlyPortal>
	);
});

export { Popup, useOnClickOutside };
