import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from './baseUrl';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    const hasAuthHeader =
      config?.headers?.Authorization || config?.headers?.authorization;

    if (token && !hasAuthHeader) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  error => Promise.reject(error),
);
