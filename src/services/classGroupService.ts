/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class ClassGroupService {
    async getClassGroups(page: number = 1, perPage: number = 10): Promise<any> {
        const response = await axiosClient.get(`/class-group`, {
            params: { page, perPage }
        });
        return { responseData: response.data, status: response.status };
    }

    async getClassGroupById(classGroupId: number): Promise<any> {
        const response = await axiosClient.get(`/class-group/${classGroupId}`);
        return { responseData: response.data, status: response.status };
    }

    async createClassGroup(payload: { school_id: number; class_name: string; amount_of_students: number }): Promise<any> {
        const response = await axiosClient.post('/class-group', payload);
        return { responseData: response.data, status: response.status };
    }

    async updateClassGroup(classGroupId: number, payload: { school_id: number; class_name: string; amount_of_students: number }): Promise<any> {
        const response = await axiosClient.put(`/class-group/${classGroupId}`, payload);
        return { responseData: response.data, status: response.status };
    }

    async deleteClassGroup(classGroupId: number): Promise<any> {
        const response = await axiosClient.delete(`/class-group/${classGroupId}`);
        return { responseData: response.data, status: response.status };
    }
}

export default new ClassGroupService();
