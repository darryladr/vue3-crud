import axios, { type AxiosInstance } from 'axios';
import { ref } from 'vue';

import router from '@/router';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isLoading = ref(false);

axiosInstance.interceptors.request.use(
  (config) => {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    isLoading.value = false;
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    isLoading.value = false;
    return response;
  },
  (error) => {
    isLoading.value = false;
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
