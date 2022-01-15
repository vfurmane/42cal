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

async function initCalendar(calendar) {
	try {
		const { token } = await client.getToken(tokenParams);
		access_token = client.createToken(token);
	} catch (error) {
		console.error(error);
	}
	
	axios({
		method: 'GET',
		url: 'https://api.intra.42.fr/v2/campus/1/events',
		headers: {
			'Authorization': `Bearer ${access_token.token.access_token}`
		}
	})
	.then((result) => {
		for (const event of result.data) {
			calendar.createEvent({
			    start: new Date(event.begin_at),
			    end: new Date(event.end_at),
			    summary: event.name,
			    description: event.description,
			    location: event.location
			});
		}
	})
	.catch((error) => {
		console.error(error);
	});
}

const calendar = ical({name: '42 Events'});

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
//	res.render('events', { events: result.data });
	calendar.serve(res);
});

app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});

initCalendar(calendar);
