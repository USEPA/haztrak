import axios from 'axios';
// import { store } from '../store';
import { store } from '../app/store';

function authToken() {
  return store.getState().user.token;
}

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = authToken();
  const isLoggedIn = !!token;
  const isApiUrl = url.startsWith(process.env.REACT_APP_HAZTRAK_API_URL);
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

function request(method) {
  const baseURL = `${process.env.REACT_APP_HAZTRAK_API_URL}/api`;
  return (url, body) => {
    const requestOptions = {
      url: `${baseURL}/${url}`,
      method,
      headers: authHeader(`${baseURL}/${url}`),
    };
    if (body) {
      requestOptions.data = body;
    }
    return axios(requestOptions).then((response) => {
      const { data } = response;

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

// eslint-disable-next-line import/prefer-default-export
const api = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

export default api;
