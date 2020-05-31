import React from "react";
import axious from "axios";
import GoogleLogin from "react-google-login";

const Google = ({ informParent = (f) => f }) => {
	const responseGoogle = (response) => {
		console.log(response.tokenId);
		axious({
			method: "POST",
			url: `${process.env.REACT_APP_API}/google-login`,
			data: { idToken: response.tokenId },
		})
			.then((response) => {
				console.log("GOOGLE SIGNIN SUCCESS", response);
				//inform parent component
				informParent(response);
			})
			.catch((error) => {
				console.log("GOOGLE SIGNIN ERROR", error.response);
			});
	};
	return (
		<div className="pb-3">
			<GoogleLogin
				clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
				// buttonText="Login" //это стандартная кнопка, мы её сейчас заменим. Ниже в 23 строке на работает пока...
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				render={(renderProps) => (
					<button
						onClick={renderProps.onClick}
						disabled={renderProps.disabled}
						className="btn btn-danger btn-lg btn-block"
					>
						<i className="fab fa-google pr-2"></i> Login with Google
					</button>
				)}
				cookiePolicy={"single_host_origin"}
			/>
		</div>
	);
};

export default Google;
