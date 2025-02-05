/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class CheckInStatusService {
    async getAll(): Promise<any> {
        const response = await axiosClient.get('/check-in-status');
        return { responseData: response.data, status: response.status };
    }

    async getById(attendanceLateType: any): Promise<any> {
        const response = await axiosClient.get(`/check-in-status/${attendanceLateType}`);
        return { responseData: response.data, status: response.status };
    }

    async create(payload: any): Promise<any> {
        const response = await axiosClient.post('/check-in-status', payload);
        return { responseData: response.data, status: response.status };
    }

    async update(attendanceLateType: any, payload: any): Promise<any> {
        const response = await axiosClient.put(`/check-in-status/${attendanceLateType}`, payload);
        return { responseData: response.data, status: response.status };
    }

    async delete(attendanceLateType: any): Promise<any> {
        const response = await axiosClient.delete(`/check-in-status/${attendanceLateType}`);
        return { responseData: response.data, status: response.status };
    }
}

export default new CheckInStatusService();
