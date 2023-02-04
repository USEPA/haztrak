/**
 * @file axios (http) instance for haztrak restful API usage
 */
import axios, { AxiosRequestConfig } from 'axios';
import { rootStore } from 'store';

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
   */
  (config: AxiosRequestConfig) => {
    config.headers = config.headers ?? {};
    const token = rootStore.getState().user.token;
    if (token) {
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
    // ToDo: if token does not exist
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default htApi;
