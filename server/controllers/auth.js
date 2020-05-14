const User = require ('../models/user');
const jwt = require('jsonwebtoken');

//sendgrid

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);




/*// закомментировали, когда стали писать email workflow
exports.signup = (req, res) => {
	//console.log("REQ BODY ON SIGNUP", req.body);
	
	//res.json({
	//	data: 'you hit signup endpoint. fffgh' // кусок кода-заглушки, пока не прописали валидаторы
	//});
	const {name, email, password} = req.body // получить данные из ввода от пользователя

	User.findOne({email: email}).exec((err, user) => { //поиск в базе данных вхождения email
		if (user){
			return res.status(400).json({
				error : 'Email is taken' //сообщение пользователю который ввел уже имеющийся в бд адрес почты
			})
		}

	});

	let newUser = new User ({name, email, password}) // если валидация прошла успешно - то создаём нового пользователя

	newUser.save((err, success) => { // сохраняем нового пользователя в базу данных
		if (err){ // если ошибка, то выводим сообщение
			console.log('SIGNUP ERROR', err)
			return res.status(400).json({
				error: err
			})
		}
		res.json({
			message: 'Signup success! Please signin.' // сообщение в случае если получилось засайниниться
		})

	});
};*/
 
exports.signup = (req, res) => {
	const {name, email, password} = req.body // получить данные из ввода от пользователя

	User.findOne({email: email}).exec((err, user) => { //поиск в базе данных вхождения email
		if (user){
			return res.status(400).json({
				error : 'Email is taken' //сообщение пользователю который ввел уже имеющийся в бд адрес почты
			});
		}

		const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '20m'}); //если такого email в базе нет - генерирует токен

		const emailData = {						//эти данные мы планируем осылать на почту пользователям импользуюя sendgrid
			from: process.env.EMAIL_FROM,
			to: email,
			subject: `Account activation link`,
			html: `
			<h1>Please use the link to activate the account</h1>
			<p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
			</hr>
			<p>This email may contain sensetive information</p>
			<p>${process.env.CLIENT_URL}

			`
		};

		sgMail
			.send(emailData)
			.then(sent => { //а это строка непосредственно дёргает sendgrid
			console.log('SUNGUP EMAIL SENT', sent)
			return res.json({message: `Email has been sent to ${email}.`
			});

		})
		.catch(err => {
                 console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.json({
                    message: `brrr ${err.message}`
                });
            });

	});
 };

exports.signin = (req, res) => {
	console.log("REQ BODY ON SIGNIN", req.body);
	res.json({
		data: 'я тебя съем'
	});
}; //test commit