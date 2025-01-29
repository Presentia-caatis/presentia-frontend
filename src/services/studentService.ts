/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class StudentService {
    async getStudent() {
        try {
            const response = await axiosClient.get(`/student`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching students`, error);
            throw error;
        }
    }

    async addStudent(payload: any) {
        try {
            const response = await axiosClient.post(`/student`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error adding students`, error);
            throw error;
        }
    }

    async storeViaFile(payload: any) {
        try {
            const response = await axiosClient.post(`/student/store-via-file`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error adding students`, error);
            throw error;
        }
    }

    async updateStudent(schoolId: string | number, studentId: string | number, payload: any) {
        try {
            const updatedPayload = { ...payload, school_id: schoolId };
            const response = await axiosClient.put(`/student/${studentId}`, updatedPayload);
            return response.data;
        } catch (error) {
            console.error(`Error updating students for student id: ${schoolId}`, error);
            throw error;
        }
    }

    async deleteStudent(studentId: string | number) {
        try {
            const response = await axiosClient.delete(`/student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting students for student id: ${studentId}`, error);
            throw error;
        }
    }
}

export default new StudentService();
