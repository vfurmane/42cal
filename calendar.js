const axios = require('axios');

async function fetchEvents(calendar, client, campus_id) {
	let access_token;
	try {
		const { token } = await client.getToken({
			scope: 'public'
		});
		access_token = client.createToken(token);
	} catch (error) {
		console.error(error);
		return Promise.reject(error);
	}
	return (axios({
		method: 'GET',
		url: `https://api.intra.42.fr/v2/campus/${campus_id}/events`,
		headers: {
			'Authorization': `Bearer ${access_token.token.access_token}`
		}
	}));
}

function getCampusCalendar(client, calendar, campus) {
	console.log(`Fetching events of the ${campus.name} campus...`);
	fetchEvents(calendar, client, campus.id)
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
		return result;
	})
	.catch((error) => {
		console.error(error.response.data);
		return error;
	});
}

module.exports = { getCampusCalendar };
