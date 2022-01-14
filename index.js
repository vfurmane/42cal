const express = require('express');
const ical = require('ical-generator');
const app = express();

const calendar = ical({name: '42 Events'});
// calendar.createEvent({
//     start: '2021-01-01',
//     summary: 'New Year',
//     description: 'First day of 2022',
// });

app.get('/', (req, res) => calendar.serve(res));

app.listen(3000, () => {
	console.log('Running on http://localhost:3000');
});
