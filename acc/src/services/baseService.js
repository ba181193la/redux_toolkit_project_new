import { useSelector } from 'react-redux';

export const apiFetch = async (
  url,
  token,
  method = 'GET',
  data = null,
  customHeaders = {}
) => {
  const headers = {
    ...customHeaders,
  };
  // if (token && url != '/ReportIncident/BriefPageLoadData') {
  //   headers['Authorization'] = `Bearer ${token}`;
  // } else {
  //   headers['Authorization'] =
  //     `Bearer ${process.env.REACT_APP_LOGIN_ACCESS_TOKEN}`;
  // }
 
  if (token && url !== '/ReportIncident/BriefPageLoadData') {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${process.env.REACT_APP_LOGIN_ACCESS_TOKEN}`;
  }


  if (data && !(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
  };

  if (data && !(data instanceof FormData)) {
    config.body = JSON.stringify(data);
  } else if (data instanceof FormData) {
    config.body = data;
  }
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}${url}`, {
      ...config,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          errorData.Errors ||
          errorData.Message ||
          'Something went wrong'
      );
    }
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {    
      data = await response.json();
    } else {
      data = await response.blob();
    }
    return data;
  } catch (error) {
    console.error('API error:', error.message);
    throw error;
  }
};

export const fetchData = async (endpoint, token) =>
  await apiFetch(endpoint, token);
export const postData = async (endpoint, token, data) =>
  await apiFetch(endpoint, token, 'POST', data);
export const updateData = async (endpoint, token, data) =>
  await apiFetch(endpoint, token, 'PUT', data);
export const deleteData = async (endpoint, token) =>
  await apiFetch(endpoint, token, 'DELETE');
