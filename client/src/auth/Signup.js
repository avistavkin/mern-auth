import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axious from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signup = () => {
	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		buttonText: 'Submit' // текст кнопки - будем менять динамически
	});

	const {name, email, password, buttonText} = values;

	const handleChange = (name) => (event) => { //обработчики событий
		console.log(event.target.value); //для новичков вывод логов в консоль
		setValues({ ...values, [name]: event.target.value});
	};

	const clickSubmit = event => { //обработчик нажатия на кнопку
		event.preventDefault()
		setValues({ ...values, buttonText: 'Submitting'});
		axious({
			method: 'POST',
			url: `${process.env.REACT_APP_API}/signup`,   //берём url из файла .env*/
			data: {name, email, password}
		})

		.then(response => {
			console.log('SIGNUP SUCCESS', response);
			//как только мы получили success - нам обязательно надо почистить state!
			setValues({...values, name: '', email: '', password: '', buttonText: 'Submitted'});
			toast.success(response.data.message);
		})
		.catch(error => {
			console.log('SIGNUP ERROR', error.response.data.error); 
			//error.response.data - данные ошибки будут переданы из бэкенда.
			setValues({...values, buttonText: 'Submit'});
			toast.error(error.response.data.error);

		});



	};

	const signupForm = () => (
		<form>
			<div className="form-group">
				<lable className="text-mute"> Name</lable>
				<input onChange={handleChange('name')} value = {name} type="text" className="form-control"/>
			</div>
			<div className="form-group">
				<lable className="text-mute"> Email</lable>
				<input onChange={handleChange('email')} value = {email} type="email" className="form-control"/>
			</div>
			<div className="form-group">
				<lable className="text-mute"> Password</lable>
				<input onChange={handleChange('password')} value = {password} type="password" className="form-control"/>
			</div>
			<div>
				<button className="btn btn-primary" onClick={clickSubmit}>{buttonText} </button>

			</div>
		</form>

	);

//{JSON.stringify({name, email, password})};  очень полезный дебагер - выводит прямо на экран*/
	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<ToastContainer />
				<h1 className="p-5 text-center">Signup to xSet!</h1>
				{signupForm()}
			</div>
		</Layout>
	);
};

export default Signup;