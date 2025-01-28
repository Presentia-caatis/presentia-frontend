/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class StudentService {
    async getStudent(schoolId: string | number) {
        try {
            const response = await axiosClient.get(`/${schoolId}/student`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching students for school id: ${schoolId}`, error);
            throw error;
        }
    }

    async addStudent(schoolId: string | number, payload: any) {
        try {
            const response = await axiosClient.post(`/${schoolId}/student`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error adding students for school id: ${schoolId}`, error);
            throw error;
        }
    }

    async updateStudent(schoolId: string | number, studentId: string | number, payload: any) {
        try {
            const updatedPayload = { ...payload, school_id: schoolId };
            const response = await axiosClient.put(`/${schoolId}/student/${studentId}`, updatedPayload);
            return response.data;
        } catch (error) {
            console.error(`Error updating students for student id: ${schoolId}`, error);
            throw error;
        }
    }

    async deleteStudent(schoolId: string | number, studentId: string | number) {
        try {
            const response = await axiosClient.delete(`/${schoolId}/student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting students for student id: ${studentId}`, error);
            throw error;
        }
    }
}

export default new StudentService();
