const axious = require ("axios");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
//sendgrid
const fetch = require('node-fetch');
const superagent = require('superagent');




const sgMail = require("@sendgrid/mail");
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
	const { name, email, password } = req.body; // получить данные из ввода от пользователя

	User.findOne({ email: email }).exec((err, user) => {
		//поиск в базе данных вхождения email
		if (user) {
			return res.status(400).json({
				error: "Email is taken", //сообщение пользователю который ввел уже имеющийся в бд адрес почты
			});
		}

		const token = jwt.sign(
			{ name, email, password },
			process.env.JWT_ACCOUNT_ACTIVATION,
			{ expiresIn: "20m" }
		); //если такого email в базе нет - генерирует токен

		const emailData = {
			//эти данные мы планируем осылать на почту пользователям импользуюя sendgrid
			from: process.env.EMAIL_FROM,
			to: email,
			subject: `Account activation link`,
			html: `
			<h1>Please use the link to activate the account</h1>
			<p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
			</hr>
			<p>This email may contain sensetive information</p>
			<p>${process.env.CLIENT_URL}

			`,
		};

		sgMail
			.send(emailData)
			.then((sent) => {
				//а это строка непосредственно дёргает sendgrid
				console.log("SUNGUP EMAIL SENT", sent);
				return res.json({
					message: `Email has been sent to ${email}.`,
				});
			})
			.catch((err) => {
				console.log("SIGNUP EMAIL SENT ERROR", err);
				return res.json({
					message: `brrr ${err.message}`,
				});
			});
	});
};

exports.accountActivation = (req, res) => {
	const { token } = req.body;

	if (token) {
		//проверка токена, что он не заэкспайрился
		jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
			err,
			decoded
		) {
			//нужно два аргумента и функция проверки
			if (err) {
				console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
				return res.status(401).json({
					error: "Expired link. Signup again",
				});
			}
			const { name, email, password } = jwt.decode(token); // через функцию decode достаём данные из токена и заполняем массив

			const user = new User({ name, email, password });

			user.save((err, user) => {
				if (err) {
					console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
					return res.status(401).json({
						error:
							"Error saving user in database. Try signup again.",
					});
				}
				return res.json({
					message: "Signup success. Please signin",
				});
			});
		});
	} else {
		return res.json({
			message: "Something went wrong. Try again.",
		});
	}
};
/*
exports.signin = (req, res) => {
	console.log("REQ BODY ON SIGNIN", req.body);
	res.json({
		data: 'я тебя съем'
	});
};*/

exports.signin = (req, res) => {
	const { email, password } = req.body;
	//check if user exist
	User.findOne({ email }).exec((err, user) => {
		//тут exec - это чисто функция mongoose
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email does not exist. Please signup.",
			});
		}
		//authenticate
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "Email or password do not match",
			});
		}
		//generate a token and send to client
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});
		const { _id, name, email, role } = user;

		return res.json({
			token,
			user: { _id, name, email, role },
		});
	});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET, //может вернуть req.user
});

exports.adminMiddleware = (req, res, next) => {
	User.findById({ _id: req.user._id }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({ error: "User not found." });
		}

		if (user.role != "admin") {
			return res
				.status(400)
				.json({ error: "Admin resource. Access denied." });
		}

		req.profile = user;
		next();
	});
};

exports.forgotPassword = (req, res) => {
	const { email } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with such email does not exist",
			});
		}

		const token = jwt.sign(
			{ _id: user._id, name: user.name },
			process.env.JWT_RESET_PASSWORD,
			{ expiresIn: "10m" }
		); //если такого email в базе нет - генерирует токен

		const emailData = {
			//эти данные мы планируем осылать на почту пользователям импользуюя sendgrid
			from: process.env.EMAIL_FROM,
			to: email,
			subject: `Password reset link`,
			html: `
			<h1>Please use the link to reset your password</h1>
			<p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
			</hr>
			<p>This email may contain sensetive information</p>
			<p>${process.env.CLIENT_URL}

			`,
		};

		return user.updateOne({ resetPasswordLink: token }, (err, success) => {
			if (err) {
				console.log("RESET PASSWORD LINK ERROR", err);
				return res.status(400).json({
					error:
						"Database connection error on user password forgot request",
				});
			} else {
				sgMail
					.send(emailData)
					.then((sent) => {
						//а это строка непосредственно дёргает sendgrid
						console.log("RESET PASSWORD EMAIL SENT", sent);
						return res.json({
							message: `Email has been sent to ${email}. Follow the instruction to reset the password.`,
						});
					})
					.catch((err) => {
						console.log("RESET PASSWORD SENT ERROR", err);
						return res.json({
							message: `brrr ${err.message}`,
						});
					});
			}
		});
	});
};

exports.resetPassword = (req, res) => {
	const { resetPasswordLink, newPassword } = req.body;

	if (resetPasswordLink) {
		jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
			err,
			decoded
		) {
			if (err) {
				return res
					.status(400)
					.json({ error: "Expired link. Try again" });
			}

			User.findOne({ resetPasswordLink }, (err, user) => {
				if (err) {
					return res.status(400).json({
						error: "Something went wrong. Try again later.",
					});
				}

				const updatedFields = {
					password: newPassword,
					resetPasswordLink: "",
				};

				user = _.extend(user, updatedFields);

				user.save((err, result) => {
					if (err) {
						return res
							.status(400)
							.json({ error: "Error resetting user password" });
					}

					res.json({
						message: `Great! Now you can login with your new password!`,
					});
				});
			});
		});
	}
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
	const { idToken } = req.body;
	client
		.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
		.then((response) => {
			//console.log('GOOGLE LOGIN RESPONSE', response)
			const { email_verified, name, email } = response.payload;
			if (email_verified) {
				User.findOne({ email }).exec((err, user) => {
					if (user) {
						const token = jwt.sign(
							{ _id: user._id },
							process.env.JWT_SECRET,
							{ expiresIn: "7d" }
						);
						const { _id, email, name, role } = user;
						return res.json({
							token,
							user: { _id, email, name, role },
						});
					} else {
						let password = email + process.env.JWT_SECRET;
						user = new User({ name, email, password });
						user.save((err, data) => {
							if (err) {
								console.log(
									"ERROR GOOGLE LOGIN ON USER SAVE",
									err
								);
								return res.status(400).json({
									error: "User signup failed with Google",
								});
							}
							const token = jwt.sign(
								{ _id: data._id },
								process.env.JWT_SECRET,
								{ expiresIn: "7d" }
							);
							const { _id, email, name, role } = data;
							return res.json({
								token,
								user: { _id, email, name, role },
							});
						});
					}
				});
			} else {
				return res.status(400).json({
					error: "Google login failed. Try again.",
				});
			}
		});
};


exports.facebookLogin = (req, res) => {
    console.log('FACEBOOK LOGIN REQ BODY', req.body);
    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;


    return (
        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            // .then(response => console.log(response))
            .then(response => 
            {
                const { email, name } = response;
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with facebook'
                                });
                            }
                            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
                res.json({
                    error: 'Facebook login failed. Try later'
                });
            })
    );
};


exports.microsoftLogin = (req, res) => {
    console.log('MICROSOFT LOGIN REQ BODY', req.body);
    const { name, email, id, accessToken } = req.body;

    const url = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`;
    
    return (
        fetch(url, {method: 'GET'})
            //.then(response => response.json())
            //.then(response => console.log('STRING416 - response', response, name))
            //.then(response => console.log('417EMAIL, NAME', email, name))
            .then(response => {
                //const { email, name } = response;
                const { email, name } = req.body;
                User.findOne({ email }).exec((err, user) => {
                	//console.log("423USER", user)
                	//console.log("424USER_ID", user._id)
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        //console.log("427TOKEN", token);
                        const { _id, email, name, role } = user;
                        //console.log("431USER", user);
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        //console.log('436LET PASSWORD')
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR MICROSOFT LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with microsoft'
                                });
                            }
                            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                });
            })
            .catch(error => {
            	console.log(error);
                res.json({
                    error: 'Microsoft login failed. Try later'
                });
            })
    );
};

exports.githubLogin = (req, res) => {
    console.log('GITHUB LOGIN REQ BODY', req.body);
    const { code } = req.body;
    console.log('CODE', code);
    const url = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;

        superagent
  		.post('https://github.com/login/oauth/access_token')
    	.send({ 
    		client_id: `${process.env.GITHUB_CLIENT_ID}`,
    		redirect_uri: `${process.env.GITHUB_REDIRECT_URI}`,
    		client_secret: `${process.env.GITHUB_CLIENT_SECRET}`,
    		code: `${code}`
		 }) // sends a JSON post body
  		.set ('Accept', 'application/json')
  		.end((err, result) => {
  			const token = result.body.access_token
  			axious({
	 		method: "GET",
	 		url: `https://api.github.com/user`,
			headers: {
            	'Content-Type': 'application/json',
            	'Authorization': `Bearer ${token}`, 	 	
        	}
			
	 	})
  				.then((response) => {
	 			const { email, login } = response.data
	 			User.findOne({ email }).exec((err, user) => {
                	//console.log("423USER", user)
                	//console.log("424USER_ID", user._id)
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        //console.log("427TOKEN", token);
                        const { _id, email, login, role } = user;
//                        console.log("539USER", user);
                        return res.json({
                            token,
                            user: { _id, email, login, role }
                        });
                    } else {
                        //console.log('436LET PASSWORD')
                        let password = email + process.env.JWT_SECRET;
                       let name = login; //попробовать обмануть, т.к. в GitHub часть name пустой...
                       user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR GITHUB LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with github'
                                });
                            }
                            const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                            const { _id, email, login, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, login, role }
                            });
                        });
                    }
                });
	 		})
  				 		.catch((error) => {
//	 			console.log("GITHUB SIGNIN ERROR", error);
	 		})

  		})
};