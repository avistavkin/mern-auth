import React from "react";
import {Link} from 'react-router-dom'
import ReactDOM from 'react-dom';
import axious from "axios";
import GithubLogin from "react-github-login";

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
			<GithubLogin
				clientId={`${process.env.REACT_APP_GITHUB_CLIENT_ID}`}
				redirectUri= {`${process.env.REACT_APP_CLIENT_URL}`}
				authCallback={responseGithub}
				//buttonTheme = "light_short"
				//debug = {false}

				//кнопка нормальная
				// children = {
				// 	<button className="btn btn-dark btn-lg btn-block">
				// 		<i className="fab fa-github pr-2"></i> Login with GitHub
				// 	</button>
				// }

			/>
		</div>
	);
 };

 export default Github;


// const onSuccess = response => console.log(response);
// const onFailure = response => console.error(response);
 
// ReactDOM.render(
//   <GitHubLogin clientId="ac56fad434a3a3c1561e"
//     onSuccess={onSuccess}
//     onFailure={onFailure}/>,
//   document.getElementById('example')
// );