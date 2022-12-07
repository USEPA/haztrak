import axios, { AxiosRequestConfig } from 'axios';
import { store } from 'redux/store';

const htApi = axios.create({
  baseURL: `${process.env.REACT_APP_HT_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * The axios intercept to apply to all requests to the Haztrak server
 */
htApi.interceptors.request.use(
  /**
   * Use the redux store to get the token and set Authorization header
   * @param config {AxiosRequestConfig}
   */
  (config: AxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const token = store.getState().user.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default htApi;
