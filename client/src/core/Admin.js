import React, {useState, useEffect} from 'react';
//import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axious from 'axios';
import {isAuth, getCookie, signout, updateUser} from '../auth/helpers'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Admin = ({history}) => {
	const [values, setValues] = useState({
		role: '',
		name: '',
		email: '',
		password: '',
		buttonText: 'Submit' // текст кнопки - будем менять динамически
	});

	const token = getCookie('token');

	useEffect(() => {
		loadProfile()
	}, []);

	const loadProfile = () => {
		axious({
			method: 'GET',
			url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
			headers: {
				Authorization: `Bearer ${token}`
			}

		})
		.then(response => {
			console.log('PROFILE UPDATE', response);
			const {role, name, email} = response.data;
			setValues({...values, role, name, email});

		})
		.catch(error => {
			console.log('PROFILE UPDATE ERROR', error.response.data.error);
			if(error.response.status == 401) {
				signout(() => {
					history.push('/');
				});
			}

		})
	}

	const {role, name, email, password, buttonText} = values;

	const handleChange = (name) => (event) => { //обработчики событий
		console.log(event.target.value); //для новичков вывод логов в консоль
		setValues({ ...values, [name]: event.target.value});
	};

	const clickSubmit = event => { //обработчик нажатия на кнопку
		event.preventDefault()
		setValues({ ...values, buttonText: 'Submitting'});
		axious({
			method: 'PUT',
			url: `${process.env.REACT_APP_API}/admin/update`,   //берём url из файла .env*/
			headers: {
				Authorization: `Bearer ${token}`
			},
			data: { name, password}
		})

		.then(response => {
			console.log('PRIVATE PROFILE UPDATE SUCCESS', response);
			updateUser(response, () =>{
				//как только мы получили success - нам обязательно надо почистить state!
				setValues({...values, buttonText: 'Submitted'});
				toast.success('Profile updated successfully');				
			});

		})
		.catch(error => {
			console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error); 
			//error.response.data - данные ошибки будут переданы из бэкенда.
			setValues({...values, buttonText: 'Submit'});
			toast.error(error.response.data.error);

		});



	};

	const updateForm = () => (
		<form>
			<div className="form-group">
				<label className="text-mute"> Role</label>
				<input defaultValue = {role} type="text" className="form-control" disabled/>
			</div>
			<div className="form-group">
				<label className="text-mute"> Name</label>
				<input onChange={handleChange('name')} value = {name} type="text" className="form-control"/>
			</div>
			<div className="form-group">
				<label className="text-mute"> Email</label>
				<input defaultValue = {email} type="email" className="form-control" disabled/>
			</div>
			<div className="form-group">
				<label className="text-mute"> Password</label>
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
				<h1 className="pt-5 text-center">Admin</h1>
				<p className = "lead text-center">Profile update</p>
				{updateForm()}
			</div>
		</Layout>
	);
};

export default Admin;
