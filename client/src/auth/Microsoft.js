import React from "react";
import axious from "axios";
import MicrosoftLogin from "react-microsoft-login";

const Microsoft = () => {
	  	const responseMicrosoft = (err, data) => {
      	console.log(err, data);
		axious({
			method: "POST",
		 	url: `${process.env.REACT_APP_API}/microsoft-login`,
		 	data: { 
		 		accessToken: data.accessToken,
		 		id: data.id
		 	},
		})
		.then((data) => {
		 	console.log("MICROSOFT SIGNIN SUCCESS", data);
		 		//inform parent component
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
				render={(renderProps) => (
					<button
						onClick={renderProps.onClick}
						className="btn btn-primary btn-lg btn-block"
					>
						<i className="fab fa-microsoft pr-2"></i> Login with
						Microsoft
					</button>
				)}
			/>
		</div>
	);
 };

export default Microsoft;
