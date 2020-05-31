import React from "react";
import axious from "axios";
import MicrosoftLogin from "react-microsoft-login";

const Microsoft = () => {
	const responseGoogle = (response) => {
		console.log(response.tokenId);
		axious({
			method: "POST",
			url: `${process.env.REACT_APP_API}/microsoft-login`,
			data: { idToken: response.tokenId },
		})
			.then((response) => {
				console.log("MICROSOFT SIGNIN SUCCESS", response);
				//inform parent component
			})
			.catch((error) => {
				console.log("MICROSOFT SIGNIN ERROR", error.response);
			});
	};
	return (
		<div className="pb-3">
			<MicrosoftLogin
				appId={`${process.env.REACT_APP_FACEBOOK_CLIENT_ID}`}
				autoLoad={false}
				//callback={responseFacebook}
				render={(renderProps) => (
					<button
						onClick={renderProps.onClick}
						className="btn btn-primary btn-lg btn-block"
					>
						<i className="fab fa-facebook pr-2"></i> Login with
						Facebook
					</button>
				)}
			/>
		</div>
	);



// 	return (
// 		<div className="pb-3">
// 			<GoogleLogin
// 				clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
// 				// buttonText="Login" //это стандартная кнопка, мы её сейчас заменим. Ниже в 23 строке на работает пока...
// 				onSuccess={responseGoogle}
// 				onFailure={responseGoogle}
// 				render={(renderProps) => (
// 					<button
// 						onClick={renderProps.onClick}
// 						disabled={renderProps.disabled}
// 						className="btn btn-danger btn-lg btn-block"
// 					>
// 						<i className="fab fa-microsoft pr-2"></i> Login with
// 						Google
// 					</button>
// 				)}
// 				cookiePolicy={"single_host_origin"}
// 			/>
// 		</div>
	//);
 };

export default Microsoft;
