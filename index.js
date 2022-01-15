const express = require('express');
const ical = require('ical-generator');
const dotenv = require('dotenv').config();
const { ClientCredentials } = require('simple-oauth2');
const { getCampusCalendar } = require('./calendar.js');
const campuses = require('./campus.js');

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

let calendars = {};
for (const campus of campuses) {
	calendars[campus.id] = ical({name: `42 Events | ${campus.name}`});
}
campuses.forEach((campus, index) => {
	setTimeout(() => {
		getCampusCalendar(client, calendars[campus.id], campus);
		setInterval(getCampusCalendar, 10 * 60 * 1000, client, calendars[campus.id], campus);
	}, 500 * index);
});

const app = express();

const default_campus = '1';
app.get('/', async (req, res) => {
	if (!calendars.hasOwnProperty(default_campus)) return res.status(404).send('The specified campus does not exist...');
	return calendars[default_campus].serve(res)
});

app.get('/campus/:id', async (req, res) => {
	if (!calendars.hasOwnProperty(req.params.id)) return res.status(404).send('The specified campus does not exist...');
	return calendars[req.params.id].serve(res)
});

app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
