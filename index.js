const express = require('express');
const ical = require('ical-generator');
const dotenv = require('dotenv').config();
const { ClientCredentials } = require('simple-oauth2');
const { fetchEvents } = require('./calendar.js');

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

const calendar = ical({name: '42 Events'});
fetchEvents(calendar, client);
const calendar_job = setInterval(fetchEvents, 5 * 60 * 1000, calendar, client);

const app = express();

app.get('/', (req, res) => calendar.serve(res));

app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
