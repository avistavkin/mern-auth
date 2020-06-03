import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axious from "axios";
import { authenticate, isAuth } from "./helpers";
import { ToastContainer, toast } from "react-toastify";
import Google from "./Google";
import Microsoft from "./Microsoft";
import Facebook from "./Facebook";
import Github from "./Github"
import "react-toastify/dist/ReactToastify.min.css";

const Signin = ({ history }) => {
	const [values, setValues] = useState({
		email: "",
		password: "",
		buttonText: "Submit", // текст кнопки - будем менять динамически
	});

	const { email, password, buttonText } = values;

	const handleChange = (name) => (event) => {
		//обработчики событий
		console.log(event.target.value); //для новичков вывод логов в консоль
		setValues({ ...values, [name]: event.target.value });
	};

	const informParent = (response) => {
		authenticate(response, () => {
			isAuth() && isAuth().role === "admin"
				? history.push("/admin")
				: history.push("/private");
		});
	};

	const clickSubmit = (event) => {
		//обработчик нажатия на кнопку
		event.preventDefault();
		setValues({ ...values, buttonText: "Submitting" });
		axious({
			method: "POST",
			url: `${process.env.REACT_APP_API}/signin`, //берём url из файла .env*/
			data: { email, password },
		})
			.then((response) => {
				console.log("SIGNIN SUCCESS", response);

				//save the response (user, token) -> localstorage and cookie
				//как только мы получили success - нам обязательно надо почистить state!
				authenticate(response, () => {
					setValues({
						...values,
						name: "",
						email: "",
						password: "",
						buttonText: "Submitted",
					});
					//toast.success(`Hey ${response.data.user.name}, Welcome back!`);
					isAuth() && isAuth().role === "admin"
						? history.push("/admin")
						: history.push("/private");
				});
			})
			.catch((error) => {
				console.log("SIGNIN ERROR", error.response.data);
				//error.response.data - данные ошибки будут переданы из бэкенда.
				setValues({ ...values, buttonText: "Submit" });
				toast.error(error.response.data.error);
			});
	};

	const signinForm = () => (
		<form>
			<div className="form-group">
				<label className="text-mute"> Email</label>
				<input
					onChange={handleChange("email")}
					value={email}
					type="email"
					className="form-control"
				/>
			</div>
			<div className="form-group">
				<label className="text-mute"> Password</label>
				<input
					onChange={handleChange("password")}
					value={password}
					type="password"
					className="form-control"
				/>
			</div>
			<div>
				<button className="btn btn-primary" onClick={clickSubmit}>
					{buttonText}{" "}
				</button>
			</div>

			<div>
				<label className="text-mute">
					{" "}
					Do not have account yet? Please
					<a href="./Signup"> Signup</a>.{" "}
				</label>
			</div>

			<div>
				<label className="text-mute">
					{" "}
					Forgot your password?
					<a href="./auth/password/forgot"> Restore it here</a>.{" "}
				</label>
			</div>
		</form>
	);

	//{JSON.stringify({name, email, password})};  очень полезный дебагер - выводит прямо на экран*/
	//{JSON.stringify(isAuth())}; выводит на экран - аутентифицирован ли пользователь
	//{isAuth() ? <Redirect to="/"/> : null} - строка перевоящая фокус клиента на закладку Home, если пользователь авторизован
	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<ToastContainer />
				{isAuth() ? <Redirect to="/" /> : null}
				<h1 className="p-5 text-center">Signin to xSet!</h1>
				<Google informParent={informParent} />
				<Facebook informParent={informParent} />
				<Microsoft informParent={informParent} />
				<Github informParent={informParent} />
				{signinForm()}
			</div>
		</Layout>
	);
};

export default Signin;
