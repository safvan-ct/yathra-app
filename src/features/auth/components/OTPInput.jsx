import React, { useRef, useState, useEffect } from "react";
import "../styles/Auth.css";

const OTPInput = ({ length = 6, onComplete }) => {
	const [otp, setOtp] = useState(new Array(length).fill(""));
	const inputRefs = useRef([]);

	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	const handleChange = (index, value) => {
		if (isNaN(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		if (value !== "" && index < length - 1) {
			inputRefs.current[index + 1].focus();
		}

		const combinedOtp = newOtp.join("");
		if (combinedOtp.length === length) {
			onComplete(combinedOtp);
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	return (
		<div className="otp-input-container">
			{otp.map((value, index) => (
				<input
					key={index}
					type="tel"
					maxLength="1"
					className="otp-field"
					value={value}
					ref={(ref) => (inputRefs.current[index] = ref)}
					onChange={(e) => handleChange(index, e.target.value)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					autoComplete="one-time-code"
				/>
			))}
		</div>
	);
};

export default OTPInput;
