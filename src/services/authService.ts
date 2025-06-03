/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class AuthService {
    async login(payload: { email_or_username: string; password: string }) {
        const response = await axiosClient.post('/login', payload);
        return { responseData: response.data, status: response.data.status };
    }

    async register(payload: { fullname: string, username: string; email: string; google_id: string, password: string, password_confirmation: string }) {
        const response = await axiosClient.post('/register', payload);
        return response.data;
    }

    async getProfile() {
        const response = await axiosClient.get('/user/get-by-token');
        return response.data;
    }

    async logout() {
        const response = await axiosClient.post('/logout');
        return response.data;
    }

    googleLogin() {
        window.location.href = `${axiosClient.defaults.baseURL}/auth-google`;
    }

    async googleCallback() {
        const response = await axiosClient.post('/auth-google-callback');
        return response.data;
    }

    async changePassword(payload: any) {
        const response = await axiosClient.put('/user/change-password',
            payload
        );
        return response.data;
    }

    async forgotPassword(email: string) {
        const response = await axiosClient.post('/forgot-password', {
            email
        });
        return response.data;
    }

    async resetPassword(payload: {
        email: string;
        token: string;
        password: string;
        password_confirmation: string;
    }) {
        const response = await axiosClient.post('/reset-password', payload);
        return response.data;
    }

}

export default new AuthService();
