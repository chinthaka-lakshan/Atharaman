import axios from 'axios';
import { API_ORIGIN } from '../config/runtimeConfig';

const LEGACY_API_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000'];

axios.interceptors.request.use((config) => {
  if (typeof config.url !== 'string') {
    return config;
  }

  const matchedOrigin = LEGACY_API_ORIGINS.find((origin) => config.url.startsWith(origin));

  if (matchedOrigin) {
    config.url = `${API_ORIGIN}${config.url.slice(matchedOrigin.length)}`;
  }

  return config;
});
