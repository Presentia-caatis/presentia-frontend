/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../utils/axiosClient";

export interface AttendanceSourcePayload {
    type: 'fingerprint' | 'rfid' | 'qr_code' | 'face_recognition';
    username: string;
    password: string;
    base_url: string;
    token?: string;
}

class AttendanceSourceService {
    async getAll(params = {}) {
        try {
            const response = await axiosClient.get('/attendance-source', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching attendance sources:', error);
            throw error;
        }
    }

    async getData() {
        try {
            const response = await axiosClient.get('/attendance-source/get-data');
            return response.data;
        } catch (error) {
            console.error('Error fetching attendance source data:', error);
            throw error;
        }
    }

    async getById(id: number) {
        try {
            const response = await axiosClient.get(`/attendance-source/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching attendance source with id ${id}:`, error);
            throw error;
        }
    }

    async create(data: AttendanceSourcePayload) {
        try {
            const response = await axiosClient.post('/attendance-source', data);
            return response.data;
        } catch (error) {
            console.error('Error creating attendance source:', error);
            throw error;
        }
    }

    async update(id: number, data: Partial<AttendanceSourcePayload>) {
        try {
            const response = await axiosClient.put(`/attendance-source/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating attendance source with id ${id}:`, error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            const response = await axiosClient.delete(`/attendance-source/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting attendance source with id ${id}:`, error);
            throw error;
        }
    }

    async login(payload: { username: string; password: string }) {
        try {
            const response = await axiosClient.post('/attendance-source/auth/login', payload);
            return response.data;
        } catch (error) {
            console.error('Error login attendance source auth:', error);
            throw error;
        }
    }
}

export default new AttendanceSourceService();
