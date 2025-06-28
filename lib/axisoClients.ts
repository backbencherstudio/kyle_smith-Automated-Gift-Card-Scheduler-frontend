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
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            console.log('Session expired. Please login again.');
        }

        if (error.response?.status === 422) {
            console.error('Validation Error:', error.response.data);
        }

        if (error.response?.status === 500) {
            console.error('Server Error:', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
