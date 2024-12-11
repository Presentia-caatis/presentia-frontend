import axiosClient from '../utils/axiosClient';

class AuthService {
    async login(payload: { email: string; password: string }) {
        const response = await axiosClient.post('/login', payload);
        return response.data;
    }


    async register(payload: { username: string; email: string; password: string, password_confirmation: string }) {
        const response = await axiosClient.post('/register', payload);
        return response.data;
    }


    async logout() {
        const response = await axiosClient.post('/logout');
        return response.data;
    }

    googleLogin() {
        window.location.href = `${axiosClient.defaults.baseURL}/auth/google`;
    }

    async googleCallback() {
        const response = await axiosClient.post('/auth/google-callback');
        return response.data;
    }
}

export default new AuthService();
