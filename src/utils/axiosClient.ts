import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export const setAxiosAuthHeaders = (csrfToken: string | null, laravelSession: string | null) => {
    axiosClient.interceptors.request.use(
        (config) => {
            console.log(csrfToken , laravelSession)
            if (csrfToken && laravelSession) {
                config.headers['Cookie'] = csrfToken;
            }

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
};

export default axiosClient;