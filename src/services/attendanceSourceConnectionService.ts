/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

export interface EnrollConnectionPayload {
    student_id: string;
    finger_id: string;
    retry: number;
    machine_number: string;
    overwrite: boolean;
}

export interface UpdateAuthProfilePayload {
    username: string;
    password: string;
}

class AttendanceSourceConnectionService {
    async getAllData(params = {}) {
        try {
            const response = await axiosClient.get('/attendance-source/connection', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching attendance source AllData:', error);
            throw error;
        }
    }

    async enroll(payload: EnrollConnectionPayload) {
        try {
            const response = await axiosClient.post('/attendance-source/connection/enroll', payload);
            return response.data;
        } catch (error) {
            console.error('Error enrolling attendance source connection:', error);
            throw error;
        }
    }

    async updateAuthProfile(payload: UpdateAuthProfilePayload) {
        try {
            const response = await axiosClient.put('/attendance-source/connection/update-auth-profile', payload);
            return response.data;
        } catch (error) {
            console.error('Error updating attendance source auth profile:', error);
            throw error;
        }
    }
}

export default new AttendanceSourceConnectionService();
