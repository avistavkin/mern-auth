const express = require('express');
const router = express.Router();

//import controller

const {signup} = require ('../controllers/auth');

//import validators

const {userSignupValidator} = require ('../validators/auth'); // тут мы импортируем всего лишь array of the check
const {runValidation} = require ('../validators'); // а тут мы импортируем саму проверку. Если файл index.js - то в пути его можно не прописывать явно

router.post('/signup', userSignupValidator, runValidation, signup); //обогатили эту строку двумя параметрами userSignupValidator, runValidation, - для загрузки массива и проведения проверки

const {signin} = require ('../controllers/auth');

router.post('/signin', signin);

module.exports = router;