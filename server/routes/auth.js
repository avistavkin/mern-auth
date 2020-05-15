const express = require('express');
const router = express.Router();

//import controller

const {signup, accountActivation, signin } = require ('../controllers/auth');

//import validators

const {userSignupValidator, userSigninValidator} = require ('../validators/auth'); // тут мы импортируем всего лишь array of the check
const {runValidation} = require ('../validators'); // а тут мы импортируем саму проверку. Если файл index.js - то в пути его можно не прописывать явно

router.post('/signup', userSignupValidator, runValidation, signup); //обогатили эту строку двумя параметрами userSignupValidator, runValidation, - для загрузки массива и проведения проверки
router.post('/account-activation', accountActivation);
router.post('/signin', userSigninValidator, runValidation, signin);

//const {signin} = require ('../controllers/auth'); //это тоже осталось от заглушки...



//router.post('/signin', signin); //старый signin, который использовали как заглушку

module.exports = router;