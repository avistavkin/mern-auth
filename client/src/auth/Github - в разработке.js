import React from "react";
//import {Link} from 'react-router-dom'
//import ReactDOM from 'react-dom';
import axious from "axios";
import MicrosoftLogin from "react-microsoft-login";

const Github = ({ informParent = (f) => f }) => {
	//const responseGithub = response => console.log(response);
	const responseGithub = (response) => {
	 	console.log(response);
	 	
	 	axious({
	 		method: "POST",
	 		url: `${process.env.REACT_APP_API}/github-login`,
			data: {code: response.code},			
	 	})
	 		.then((response) => {
	 			console.log("GITHUB SIGNIN SUCCESS", response);
	// 			//inform parent component
				informParent(response);
	 		})
	 		.catch((error) => {
	 			console.log("GITHUB SIGNIN ERROR", error.response);
	 		});
	 };
	return (
			<div className="pb-3">
			<MicrosoftLogin
				clientId={`${process.env.REACT_APP_GITHUB_CLIENT_ID}`}
				redirectUri= {`${process.env.REACT_APP_CLIENT_URL}`}
				//onSuccess={responseGithub}
				//onFailure={responseGithub}
				//clientId={`${process.env.REACT_APP_MICROSOFT_CLIENT_ID}`}
				authCallback={responseGithub}
				children = {
					<button className="btn btn-light btn-outline-secondary btn-lg btn-block">
						<i className="fab fa-github pr-2"></i> Login with Microsoft
					</button>
				}

			/>
		</div>

	);
};
export default Github;