export const ftApiConfig = () => ({
  ft: {
    api: {
      base_url: 'https://api.intra.42.fr',
      default_scope: 'public',
      pagination: {
        first_page_number: 1,
        link_header: 'Link',
        search_param_key: 'page',
      },
      secondly_interval: 1000,
      requests_per_second: 2,
      hourly_interval: 1000 * 60 * 60,
      requests_per_hour: 1200,
    },
    default_campus_id: 1,
  },
});
