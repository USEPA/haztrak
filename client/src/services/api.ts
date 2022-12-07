import axios, { AxiosRequestConfig } from 'axios';
import { store } from 'redux/store';

function authToken() {
  return store.getState().user.token;
}

function authHeader(url: string) {
  // return auth header with jwt if logged in and request is to the haztrak server
  const token = authToken();
  const isLoggedIn = !!token;
  const haztrakURL = process.env.REACT_APP_HT_API_URL;
  let isApiUrl: boolean;
  if (typeof haztrakURL === 'string') {
    isApiUrl = url.startsWith(haztrakURL);
  } else {
    isApiUrl = false;
  }
  if (isLoggedIn && isApiUrl) {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

function request(method: string) {
  const baseURL = `${process.env.REACT_APP_HT_API_URL}/api`;
  return (url: string, body?: object | null, params?: object | undefined) => {
    // Configure the request
    const requestOptions: AxiosRequestConfig = {
      url: `${baseURL}/${url}`,
      method,
      headers: authHeader(`${baseURL}/${url}`),
      data: null,
    };
    // Set request parameters and body (when applicable)
    if (body) {
      requestOptions.data = body;
    }
    if (params) {
      requestOptions.params = params;
    }
    return axios(requestOptions as any).then((response) => {
      const { data } = response;
      // leaving this log statement for the time being, every time we call the api, there's output to the console with the response body
      if (!response.status) {
        if ([401, 403].includes(response.status) && authToken()) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          const logout = () => store.dispatch({ type: 'user/logout' });
          logout();
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  };
}

const api = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

export default api;
