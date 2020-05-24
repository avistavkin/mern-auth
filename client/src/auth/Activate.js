import React, {useState, useEffect } from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axious from 'axios';
import jwt from 'jsonwebtoken';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Activate = ({ match }) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        show: true
    });

    useEffect(() => {
        
        let token = match.params.token; //берэм токен из параметров match
        let { name } = jwt.decode(token); //декодируем токен
       if (token) {
          setValues({ ...values, name, token }); //получаем из декодированного токена имя
        }
    }, []); // с пустыми квадратными скобками - функция будет выполняться какждый раз, когда что-то меняется: name, token или show

	const { name, token, show } = values;

	const clickSubmit = event => { //обработчик нажатия на кнопку
		event.preventDefault()
		axious({
			method: 'POST',
			url: `${process.env.REACT_APP_API}/account-activation`,   //берём url из файла .env*/
			data: { token }
		})

		.then(response => {
			console.log('ACCOUNT ACTIVATION SUCCESS', response);
			//как только мы получили success - нам обязательно надо почистить state!
			setValues({...values, email: '', show: false });
			toast.success(response.data.message);
		})
		.catch(error => {
			console.log('ACCOUNT ACTIVATION ERROR', error.response.data.error); 
			//error.response.data - данные ошибки будут переданы из бэкенда.
			toast.error(error.response.data.error);
		});



	};

    const activationLink = () => (
        <div className="text-center">
            <h1 className="p-5">Hey {name}, Ready to activate your account?</h1>
            <button className="btn btn-outline-primary" onClick={clickSubmit}>
                Activate Account
            </button>
        </div>
    );

	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<ToastContainer />
				{activationLink()}
			</div>
		</Layout>
	);
};

export default Activate;