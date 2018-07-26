const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('express-flash');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(morgan('dev'));

app.engine('.hbs', expressHbs({ defaultLayout : 'layout', extname:'.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'ayaguruminewsletterv1',
	store: new mongoStore({ url: 'mongodb://hadikurniawans:workhard96@ds153851.mlab.com:53851/ayagurumi_newsletter'})
}));

app.use(flash());

app.route('/')
	.get((req,res,next) => {
		res.render('main/home', { message: req.flash("success")});
	})

	.post((req, res, next) => {
		// console.log(req.body.email);
		request({
			url: 'https://us18.api.mailchimp.com/3.0/lists/f7dbc24318/members',
			method: 'POST',
			headers:{
				'Authorization' : 'randomUser ba849bea701017904b9c4bc5cd01e6a9-us18',
				'Content-Type' : 'application/json'

			},
			json:{
				'email_address' : req.body.email,
				'status' : 'subscribed'

			}

		}, function(err, response, body){
			if (err){
				console.log(err);
			}else{
				req.flash('success', 'you have submitted your email');
				res.redirect('/');
			}

		})

	})

app.listen(3030, (err) => {
	if (err){
		console.log(err);
	}else{
		console.log('listening port 3030');
	}
});