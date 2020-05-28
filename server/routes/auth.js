const express = require('express');
const router = express.Router();

//import controller

const {signup, accountActivation, signin, forgotPassword, resetPassword } = require ('../controllers/auth');

//import validators

const {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require ('../validators/auth'); // тут мы импортируем всего лишь array of the check
const {runValidation} = require ('../validators'); // а тут мы импортируем саму проверку. Если файл index.js - то в пути его можно не прописывать явно

router.post('/signup', userSignupValidator, runValidation, signup); //обогатили эту строку двумя параметрами userSignupValidator, runValidation, - для загрузки массива и проведения проверки
router.post('/account-activation', accountActivation);
router.post('/signin', userSigninValidator, runValidation, signin);


//forgot reset password 

router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

module.exports = router;