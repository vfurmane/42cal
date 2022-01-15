const axios = require('axios');

async function fetchEvents(calendar, client) {
	console.log('fetching events...');
	let access_token;
	try {
		const { token } = await client.getToken({
			scope: 'public'
		});
		access_token = client.createToken(token);
	} catch (error) {
		console.error(error);
		return;
	}
	initCalendar(calendar, access_token.token.access_token);
}

async function initCalendar(calendar, access_token) {
	axios({
		method: 'GET',
		url: 'https://api.intra.42.fr/v2/campus/1/events',
		headers: {
			'Authorization': `Bearer ${access_token}`
		}
	})
	.then((result) => {
		calendar.clear();
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

module.exports = { fetchEvents };
