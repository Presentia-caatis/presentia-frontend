/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class StudentService {
    async getStudent(schoolId: string | number) {
        try {
            const response = await axiosClient.get(`/${schoolId}/student`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching students for school_id: ${schoolId}`, error);
            throw error;
        }
    }

    async addStudent(schoolId: string | number, payload: any) {
        try {
            const response = await axiosClient.post(`/${schoolId}/student`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error fetching students for school_id: ${schoolId}`, error);
            throw error;
        }
    }
}

export default new StudentService();
