import axios from 'axios';
import { getAuthUserFromHelper } from './authHelper';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const authUser = getAuthUserFromHelper();
        if (authUser?.roles.includes('super_admin') && authUser.school_id) {
            config.headers['School-Id'] = authUser.school_id;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


export default axiosClient;
