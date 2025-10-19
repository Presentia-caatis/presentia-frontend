import axiosClient from '../utils/axiosClient';

export type SemesterPayload = {
    academic_year?: string;
    period?: "odd" | "even";
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
};

export type MigrationConfig = {
    copy_all_check_in_status?: boolean;
    copy_all_check_out_status?: boolean;
    copy_all_absence_permit_type?: boolean;
};

class SemesterService {
    async getAll(page = 1, perPage = 10) {
        const res = await axiosClient.get("/semester", { params: { page, perPage } });
        return res.data;
    }

    async getCurrent() {
        const res = await axiosClient.get("/semester/current");
        return res.data;
    }

    async create(payload: Required<SemesterPayload>, migration?: MigrationConfig) {
        const res = await axiosClient.post("/semester", { ...payload, ...migration });
        return res.data;
    }

    async update(id: number | string, payload: SemesterPayload) {
        const res = await axiosClient.put(`/semester/${id}`, payload);
        return res.data;
    }

    async delete(id: number | string) {
        const res = await axiosClient.delete(`/semester/${id}`);
        return res.data;
    }

    async toggleActive(id: number | string) {
        const res = await axiosClient.put(`/semester/is-active-toogle/${id}`);
        return res.data;
    }

    async getById(id: number | string) {
        const res = await axiosClient.get(`/semester/${id}`);
        return res.data;
    }
}

export default new SemesterService();
