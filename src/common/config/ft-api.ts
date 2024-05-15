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
      rate_limit_wait: 500,
    },
    default_campus_id: 1,
  },
});
