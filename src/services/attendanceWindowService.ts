/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class AttendanceWindowService {
    async getAttendanceWindow(params = {}) {
        try {
            const response = await axiosClient.get(`/attendance-window`, { params });
            return response.data;
        } catch (error) {
            console.error(`There was an error fetching the attendance window`, error);
            throw error;
        }
    }
    async updateAttendanceWindow(id: number, data: any) {
        try {
            const response = await axiosClient.put(`/attendance-window/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating attendance window:', error);
            throw error;
        }
    }

    async generateAttendanceWindow(data: any) {
        try {
            const response = await axiosClient.post(`/attendance-window/generate-window`, data);
            return response.data;
        } catch (error) {
            console.error('Error generating attendance window:', error);
            throw error;
        }
    }

    async deleteAttendanceWindow(id: number | string) {
        try {
            const response = await axiosClient.delete(`/attendance-window/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting attendance window:', error);
            throw error;
        }
    }

}

export default new AttendanceWindowService();
