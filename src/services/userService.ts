/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class UserService {
    async getUsers(): Promise<any> {
        const response = await axiosClient.get('/user');
        return { responseData: response.data, status: response.status };
    }

    async getUserById(userId: number): Promise<any> {
        const response = await axiosClient.get(`/user/${userId}`);
        return { responseData: response.data, status: response.status };
    }

    async getUserByToken(): Promise<any> {
        const response = await axiosClient.get('/user/get-by-token');
        return { responseData: response.data, status: response.status };
    }

    async createUser(payload: { fullname: string; username: string; school_id?: number; email: string; password: string; password_confirmation: string }): Promise<any> {
        const response = await axiosClient.post('/user', payload);
        return { responseData: response.data, status: response.status };
    }
    async updateUser(payload: FormData): Promise<any> {
        const response = await axiosClient.post(`/user`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                _method: 'PUT'
            }
        });
        return { responseData: response.data, status: response.status };
    }


    async deleteUser(userId: number): Promise<any> {
        const response = await axiosClient.delete(`/user/${userId}`);
        return { responseData: response.data, status: response.status };
    }

    async linkUserToSchool(userId: number, schoolId?: number): Promise<any> {
        const response = await axiosClient.post(`/user/link-to-school/${userId}`, { school_id: schoolId });
        return { responseData: response.data, status: response.status };
    }
}

export default new UserService();
