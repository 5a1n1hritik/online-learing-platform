import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend URL
  withCredentials: true, 
});

// Attach access token to headers
API.interceptors.request.use(
  (config) => {
    // const csrfToken = sessionStorage.getItem('csrfToken'); // Assuming you store the CSRF token in sessionStorage after login
    // if (csrfToken) {
    //   config.headers['X-CSRF-Token'] = csrfToken; // Attach CSRF token
    // }
    const accessToken = sessionStorage.getItem('accessToken'); // token stored temporarily
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token automatically
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired and refresh token available
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await API.post('/auth/refresh-token');
        const newAccessToken = res.data.accessToken;

        // Save new token
        sessionStorage.setItem('accessToken', newAccessToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token expired. Please login again.', refreshError);
        window.location.href = "/login"; // redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default API;
