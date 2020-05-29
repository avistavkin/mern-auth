import React, {useState} from 'react';
import Layout from '../core/Layout';
import axious from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Forgot = ({history}) => {
	const [values, setValues] = useState({
		email: '',
		buttonText: 'Request password reset link' // текст кнопки - будем менять динамически
	});

	const {email, buttonText} = values;

	const handleChange = (name) => (event) => { //обработчики событий
		console.log(event.target.value); //для новичков вывод логов в консоль
		setValues({ ...values, [name]: event.target.value});
	};

	const clickSubmit = event => { //обработчик нажатия на кнопку
		event.preventDefault();
		setValues({ ...values, buttonText: 'Submitting'});
		axious({
			method: 'PUT',
			url: `${process.env.REACT_APP_API}/forgot-password`,   //берём url из файла .env*/
			data: { email }
		})

		.then(response => {
			console.log('FORGOT PASSWORD SUCCESS', response);
			toast.success(response.data.message);
			setValues({...values, buttonText: 'Requested'});
		})

		.catch(error => {
			console.log('FORGOT PASSWORD ERROR', error.response.data); 
			//error.response.data - данные ошибки будут переданы из бэкенда.
			toast.error(error.response.data.error);
			setValues({...values, buttonText: 'Request password reset link'});
		});
	};

	const passwordForgotForm = () => (
		<form>
			<div className="form-group">
				<label className="text-mute"> Email</label>
				<input onChange={handleChange('email')} value = {email} type="email" className="form-control"/>
			</div>

			<div>
				<button className="btn btn-primary" onClick={clickSubmit}>{buttonText} </button>

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
				<h1 className="p-5 text-center">Forgot password</h1>
				{passwordForgotForm()}
			</div>
		</Layout>
	);
};

export default Forgot;