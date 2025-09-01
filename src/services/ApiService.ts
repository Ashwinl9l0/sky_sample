import axios from "axios";

// Create an Axios instance
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
});

// REQUEST INTERCEPTOR
apiService.interceptors.request.use(
  (config) => {
    //for Auth
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized – maybe redirect to login");
      }
    }
    return Promise.reject(error);
  }
);

export default apiService;
