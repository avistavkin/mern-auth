import React from "react";
//import {Link} from 'react-router-dom'
//import ReactDOM from 'react-dom';
import axious from "axios";
//import GithubLogin from "react-github-login";
const superagent = require('superagent');
const cors = require('cors');
// const express = require("express");
//const app = express();
//app.use(cors());



const Github = ({ informParent = (f) => f }) => {
	//const responseGithub = response => console.log(response);
	const responseGithub = (response) => {

	 	//alert('hello11')
	 	//console.log("response", response);
	 	
// 	 	superagent
//   		.post('https://github.com/login/oauth/authorize')
//     	.send({ 
//     		clientId: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
//     		redirectUri: `${process.env.REACT_APP_CLIENT_URL}`,
    		
// 		 }) // sends a JSON post body
//   		.set ('Accept', 'application/json')
//   		.set('Access-Control-Allow-Origin', 'https://github.com/login/oauth/authorize*')
//   		.set('Access-Control-Allow-Headers', 'X-Requested-With')
//   		.end((err, result) => {
//   			//onst token = result.body
//   			console.log('29LINE', result.body)
// })


	 	// axious({
	 	
	 	// 	method: "GET",
	 	// 	url: `https://github.com/login/oauth/authorize`,
	 	// 	mode: 'no-cors',
			//   withCredentials: false,
			//   headers: {
			//     'Access-Control-Allow-Origin' : '*',
			//     'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			// // headers: {
	  		
	  // // 		    'Access-Control-Allow-Origin' : '*',
   // //    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
   // //    'Access-Control-Allow-Credentials':true
			// },
			// crossdomain: true, 
			// data: {
			// 	clientId:`${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
			// 	redirectUri: `${process.env.REACT_APP_CLIENT_URL}`,
			// }
			

	 	// })
	 	// .then((response) => {
	 	// 	console.log("CODE", response.data);
	 	// })




//вот так работает, если код передать в открытом виде


	 	axious({
	 		method: "POST",
	 		url: `${process.env.REACT_APP_API}/github-login`,
			data: {code: "60d76a86176b19f17fd6"},
			//data: {code: response.code},			
	 	})
	 		.then((response) => {
	 			console.log("GITHUB SIGNIN SUCCESS", response);
	// 			//inform parent component
				informParent(response);
	 		})
	 		.catch((error) => {
	 			console.log("GITHUB SIGNIN ERROR", error.response);
	 		});

//вот так работает, если код передать в открытом виде
	 };
	return (

	<div className="pb-3">
			


				

						<button  className="btn btn-dark btn-lg btn-block"
						// onSuccess={responseGithub}
						// onFailure={responseGithub}
						// onClick={responseGithub}
						onClick={responseGithub}

						>
							<i className="fab fa-github pr-2"></i> Login with GitHub
						</button>


		</div>

	);
};

export default Github;