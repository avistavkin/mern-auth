import React from "react";
import axious from "axios";
import MicrosoftLogin from "react-microsoft-login";

const Microsoft = ({ informParent = (f) => f }) => {
	  	const responseMicrosoft = (err, authData) => {
		axious({
			method: "POST",
		 	url: `${process.env.REACT_APP_API}/microsoft-login`,
		 	data: { 
		 		accessToken: authData.authResponseWithAccessToken.accessToken,
		 		id: authData.authResponseWithAccessToken.account.accountIdentifier,
		 		email: authData.authResponseWithAccessToken.account.userName,
		 		name: authData.authResponseWithAccessToken.account.name
		 	},


		})

		.then((authData) => {
		 	console.log("MICROSOFT SIGNIN SUCCESS", authData);
		 		//inform parent component
		 	informParent(authData);
		})
		.catch((err) => {
		 	console.log("MICROSOFT SIGNIN ERROR", err.response);
		});
	};
	return (
		<div className="pb-3">
			<MicrosoftLogin
				clientId={`${process.env.REACT_APP_MICROSOFT_CLIENT_ID}`}
				authCallback={responseMicrosoft}
				buttonTheme = "dark_short"
				debug = {false}
				children = {
					<button className="btn btn-light btn-outline-secondary btn-lg btn-block">
						<i className="fab fa-microsoft pr-2"></i> Login with Microsoft
					</button>
				}

			/>
		</div>
	);
 };

export default Microsoft;
