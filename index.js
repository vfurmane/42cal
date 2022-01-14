const express = require('express');
const dotenv = require('dotenv').config();
const ical = require('ical-generator');
const { ClientCredentials } = require('simple-oauth2');
const axios = require('axios');
const app = express();

app.use(express.json());
let access_token;
const callback_url = 'http://localhost:3000/callback';

const config = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET 
	},
	auth: {
		tokenHost: 'https://api.intra.42.fr',
		tokenPath: '/oauth/token',
		authorizePath: '/oauth/authorize'
	}
};

const client = new ClientCredentials(config);

const tokenParams = {
  scope: 'public'
};

async function checkToken(req, res, next) {
	if (!access_token) {
		return res.redirect('/auth');
	}
	else if (access_token.expired()) {
		try {
			const { token } = await client.getToken(tokenParams);
			access_token = client.createToken(token);
		} catch (error) {
			return res.send('error');
		}
	}
	next();
}

const calendar = ical({name: '42 Events'});
// calendar.createEvent({
//     start: '2021-01-01',
//     summary: 'New Year',
//     description: 'First day of 2022',
// });

app.set('view engine', 'ejs');
// app.get('/', (req, res) => calendar.serve(res));
app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in</a>');
});

app.get('/auth', (req, res) => {
	res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${config.client.id}&redirect_uri=${callback_url}&response_type=code`);
});

app.get('/callback', async (req, res) => {
	try {
		const { token } = await client.getToken(tokenParams);
		access_token = client.createToken(token);
		res.redirect('/api');
	} catch (error) {
		return res.send('error');
	}
});

app.get('/api', checkToken, (req, res) => {
	axios({
		method: 'GET',
		url: 'https://api.intra.42.fr/v2/campus/1/events',
		headers: {
			'Authorization': `Bearer ${access_token.token.access_token}`
		}
	})
	.then((result) => {
		res.render('events', { events: result.data });
	})
	.catch((error) => {
		res.send(error);
	});
});

app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
