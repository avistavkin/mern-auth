import React from "react";
import axious from "axios";
import MicrosoftLogin from "react-microsoft-login";

const Microsoft = ({ informParent = (f) => f }) => {
	  	const responseMicrosoft = (err, authData) => {
      	console.log(err, authData);
      	console.log('ACCESSTOKEN', authData.authResponseWithAccessToken.accessToken);
      	console.log('EMAIL', authData.authResponseWithAccessToken.account.userName)
		console.log('USERNAME', authData.authResponseWithAccessToken.account.name)
		console.log('ID', authData.authResponseWithAccessToken.account.accountIdentifier);
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
				debug = {true}
				children = {
					<button className="btn btn-blue btn-lg btn-block">
						<i className="fab fa-microsoft pr-2"></i> Login with Microsoft
					</button>
				}

			/>
		</div>
	);
 };

export default Microsoft;
