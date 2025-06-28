import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response?.status === 401) {
            // Unauthorized - clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            // You can add redirect to login page here
            console.log('Session expired. Please login again.');
        }
        
        if (error.response?.status === 422) {
            // Validation errors - log for debugging
            console.error('Validation Error:', error.response.data);
        }
        
        if (error.response?.status === 500) {
            // Server error
            console.error('Server Error:', error.response.data);
        }
        
        // Always reject the error so components can handle it
        return Promise.reject(error);
    }
);

export default axiosClient;
