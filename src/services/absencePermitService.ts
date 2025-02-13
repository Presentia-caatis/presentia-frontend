/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class AbsencePermitTypeService {
    async getAll(page: number = 1, perPage: number = 10) {
        const response = await axiosClient.get('/absence-permit-type', {
            params: { page, perPage }
        });
        return response.data;
    }

    async getById(id: any) {
        const response = await axiosClient.get(`/absence-permit-type/${id}`);
        return response.data;
    }

    async create(payload: any) {
        const response = await axiosClient.post('/absence-permit-type', payload);
        return response.data;
    }

    async update(id: any, payload: any) {
        const response = await axiosClient.put(`/absence-permit-type/${id}`, payload);
        return response.data;
    }

    async delete(id: any) {
        const response = await axiosClient.delete(`/absence-permit-type/${id}`);
        return response.data;
    }
}

class AbsencePermitService {
    async getAll() {
        const response = await axiosClient.get('/absence-permit');
        return response.data;
    }

    async getById(id: any) {
        const response = await axiosClient.get(`/absence-permit/${id}`);
        return response.data;
    }

    async create(payload: any) {
        const response = await axiosClient.post('/absence-permit', payload);
        return response.data;
    }

    async update(id: any, payload: any) {
        const response = await axiosClient.put(`/absence-permit/${id}`, payload);
        return response.data;
    }

    async delete(id: any) {
        const response = await axiosClient.delete(`/absence-permit/${id}`);
        return response.data;
    }
}

export const absencePermitTypeService = new AbsencePermitTypeService();
export const absencePermitService = new AbsencePermitService();
