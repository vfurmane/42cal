# 42cal

An iCal API to see the 42 events in a calendar.

## Installation

You have to create a new intra app (**Settings > API > REGISTER A NEW APP**). Fill in the form however you like.

Create a `.env` file with the following variables:

```
CLIENT_ID=
CLIENT_SECRET=
```

And fill it with the client credentials.

Then, start the server:

```sh
npm start
```

### Add a campus

In the file `campus.js`, you'll find an array containing all the supported campuses. Uncomment the ones that you'd like to use.

```js
const campuses = [
//  ...
//  { "id": 7, "name": "Fremont" },
//  { "id": 6, "name": "Chisinau" },
//  { "id": 5, "name": "Johannesburg" },
//  { "id": 2, "name": "Cluj" },
    { "id": 1, "name": "Paris" }
];
```

## License

Licensed under MIT License, Copyright 2022 Valentin Furmanek.
