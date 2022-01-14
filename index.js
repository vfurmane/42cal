const express = require('express');
const dotenv = require('dotenv').config();
const ical = require('ical-generator');
const { ClientCredentials } = require('simple-oauth2');
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
		res.redirect('/auth');
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

// app.get('/', (req, res) => calendar.serve(res));
app.get('/', (req, res) => {
  res.send('Hello<br><a href="/auth">Log in</a>');
});


app.get('/auth', (req, res) => {
	res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${callback_url}&response_type=code`);
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
	res.send('api here');
});

app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
