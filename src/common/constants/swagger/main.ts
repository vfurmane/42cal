export const SWAGGER_DOCUMENT_TITLE = '42cal';
export const SWAGGER_DOCUMENT_DESCRIPTION =
  'An iCal API to see the 42 events in a calendar. <br />' +
  'All /events route are protected with HTTP Basic authentication, but most of the ICS clients does not support authentication. \n' +
  'However, it is also possible to pass the Basic authentication token using the `basic` query param (e.g. `GET /events?basic=<_token_>`).';
export const SWAGGER_DOCUMENT_VERSION = process.env.npm_package_version ?? '0.0.0';
export const SWAGGER_DOCUMENT_ROUTE = 'swagger';
