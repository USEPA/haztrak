import axios from 'axios';
import { store } from '../app/store';

interface RequestOptions {
  url: string;
  method: string;
  headers: object;
  data: object | null;
}

function authToken() {
  return store.getState().user.token;
}

function authHeader(url: string) {
  // return auth header with jwt if user is logged in and request is to the api url
  const token = authToken();
  const isLoggedIn = !!token;
  const haztrakURL = process.env.REACT_APP_HAZTRAK_API_URL;
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
  const baseURL = `${process.env.REACT_APP_HAZTRAK_API_URL}/api`;
  return (url: string, body: object | null) => {
    const requestOptions: RequestOptions = {
      url: `${baseURL}/${url}`,
      method,
      headers: authHeader(`${baseURL}/${url}`),
      data: null,
    };
    if (body) {
      requestOptions.data = body;
    }
    return axios(requestOptions as any).then((response) => {
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
