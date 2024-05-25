# 42cal

An iCal API to see the 42 events in a calendar.

## Using the API

The API allows one to fetch all the 42 events as an ICS file.

The route is the following:

```http request
GET /events?campusIds=1,37&cursusIds=9,21
```

> [!NOTE]
> All query filters are optional.

## Installation

### Configuration

You have to create a new intra app (**Settings** > **API** > **REGISTER A NEW APP**). You may find more information on the [intra API documentation](https://api.intra.42.fr/apidoc/guides/getting_started#create-an-application).

Create a *.env* file with the following variables:

```
FT_API_CLIENT_ID=
FT_API_CLIENT_SECRET=

AUTH_BASIC_USERNAME=
AUTH_BASIC_PASSWORD=
```

### Run with Docker

The easiest way to deploy this app is to use Docker. Just run the following command:

```shell
docker run \
    --env-file .env \
    --publish 3000:3000 \
    ghcr.io/vfurmane/42cal:latest
```

## License

Licensed under MIT License, Copyright 2024 Valentin Furmanek.
