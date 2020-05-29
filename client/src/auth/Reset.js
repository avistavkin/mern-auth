import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import jwt from "jsonwebtoken";
import axious from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Reset = ({ match }) => {
	const [values, setValues] = useState({
		name: "",
		token: "",
		newPassword: "",
		buttonText: "Reset password", // текст кнопки - будем менять динамически
	});

	useEffect(() => {
		let token = match.params.token;
		let { name } = jwt.decode(token);
		if (token) {
			setValues({ ...values, name, token });
		}
	}, []);

	const { name, token, newPassword, buttonText } = values;

	const handleChange = (event) => {
		setValues({ ...values, newPassword: event.target.value });
	};

	const clickSubmit = (event) => {
		//обработчик нажатия на кнопку
		event.preventDefault();
		setValues({ ...values, buttonText: "Submitting" });
		axious({
			method: "PUT",
			url: `${process.env.REACT_APP_API}/reset-password`, //берём url из файла .env*/
			data: { newPassword, resetPasswordLink: token },
		})
			.then((response) => {
				console.log("RESET PASSWORD SUCCESS", response);
				toast.success(response.data.message);
				setValues({ ...values, buttonText: "Done" });
			})

			.catch((error) => {
				console.log("RESET PASSWORD ERROR", error.response.data);
				//error.response.data - данные ошибки будут переданы из бэкенда.
				toast.error(error.response.data.error);
				setValues({
					...values,
					buttonText: "Reset password",
				});
			});
	};

	const passwordResetForm = () => (
		<form>
			<div className="form-group">
				<label className="text-mute"> Password</label>
				<input
					onChange={handleChange}
					value={newPassword}
					type="password"
					className="form-control"
					placeholder="Type new password"
					required
				/>
			</div>

			<div>
				<button className="btn btn-primary" onClick={clickSubmit}>
					{buttonText}{" "}
				</button>
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
				<h1 className="p-5 text-center">
					Hey {name}, type your new password
				</h1>
				{passwordResetForm()}
			</div>
		</Layout>
	);
};

export default Reset;
