export const SWAGGER_EVENTS_ROUTE = {
  request: {
    summary: 'Fetch all events at 42',
  },
  response: {
    ok: {
      description: 'Events are returned as ICS format.',
    },
    unauthorized: { description: 'Unauthorized.' },
  },
  query: {
    campusIds: {
      description: 'The campuses to filter in.',
      type: [Number],
      example: '1,37',
      required: false,
    },
    cursusIds: {
      description: 'The curriculums (cursus in 42 API) to filter in.',
      type: [Number],
      example: '9,21',
      required: false,
    },
    rncp: {
      description: 'EXPERIMENTAL – Whether to include only events that count in RNCP completion or not',
      type: Boolean,
      required: false,
    },
    basic: {
      description: 'HTTP Basic authentication token. Required only if `Authorization` header is not set.',
      type: String,
      example: 'dXNlcjpwYXNz',
      required: false,
    },
  },
};
