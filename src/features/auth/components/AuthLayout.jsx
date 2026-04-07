import React from "react";
import "../styles/Auth.css";

const AuthLayout = ({ titleText, subText, children }) => {
	return (
		<div className="app-shell">
			<div className="app-header">
				<div className="bus-icon-circle">🚌</div>
				<h3 className="fw-bold mb-1" id="titleText">
					{titleText}
				</h3>
				<p className="small opacity-75" id="subText">
					{subText}
				</p>
			</div>

			<div className="login-body">
				{children}

				<div className="footer-links pb-3 mt-4">
					<p className="mb-0">
						Need help?{" "}
						<a href="#" className="text-primary text-decoration-none fw-bold">
							Support
						</a>
					</p>
					<div className="opacity-50 small auth-footer-copyright">
						&copy; {new Date().getFullYear()} YATHRA. ALL RIGHTS RESERVED.
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
