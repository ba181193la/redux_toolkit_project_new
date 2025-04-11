import { apiFetch } from './baseService';
const customFetchBaseQuery = ({ baseUrl }) => {
  return async ({ url, method = 'GET', body, headers = {} }, { getState }) => {
    const token = getState().auth.token;
    try {
      const result = await apiFetch(url, token, method, body, headers);
      return { data: result };
    } catch (error) {
      console.log('...errrrr', error);
      return {
        error: {
          status: error.status ? error.status : error.Status,
          data: error.message ? error.message : error.Message,
        },
      };
    }
  };
};

export default customFetchBaseQuery;
