import axiosClient from '../utils/axiosClient';

class SchoolInvitationService {
    async index(page = 1, params = {}) {
        return await axiosClient.get('/school-invitation', {
            params: {
                page,
                ...params
            },
        });
    }


    async getBySender() {
        const response = await axiosClient.get('/school-invitation/sender');
        return response.data;
    }

    async getByReceiver() {
        const response = await axiosClient.get('/school-invitation/receiver');
        return response.data;
    }

    async store(payload: {
        receiver_id: number;
        role_to_assign_id: number;
        school_id: number;
    }) {
        const response = await axiosClient.post('/school-invitation', payload);
        return response.data;
    }

    async update(id: number, payload: {
        role_id?: number;
        message?: string;
    }) {
        const response = await axiosClient.put(`/school-invitation/${id}`, payload);
        return response.data;
    }

    async destroy(id: number) {
        const response = await axiosClient.delete(`/school-invitation/${id}`);
        return response.data;
    }

    async respondInvitation(invitation_id: number, payload: {
        status: 'accepted' | 'rejected';
        school_id: number;
    }) {
        const response = await axiosClient.post(`/school-invitation/respond/${invitation_id}`, payload);
        return response.data;
    }
}

export default new SchoolInvitationService();
