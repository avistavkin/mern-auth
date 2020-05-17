import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axious from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Signup = () => {
	const [values, setValue] = useState({
		name: '',
		email: '',
		password: '',
		buttonText: 'Submit' // текст кнопки - будем менять динамически
	});

	const {name, email, password, buttonText} = values

	const handleChange = (name) => (event) => {

	};

	const clickSubmit = event => {


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
				<button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
			</div>
		</form>

		);

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