import axiosClient from '../utils/axiosClient';

export interface School {
  id?: number;
  subscription_plan_id: number;
  school_name: string;
  address: string;
  latest_subscription: string;
  end_subscription: string;
  created_at?: string;
  updated_at?: string;
  logoImagePath?: string,
}

class SchoolService {
  async getAll() {
    const response = await axiosClient.get('/school');
    return response.data;
  }

  async getById(id: number) {
    const response = await axiosClient.get(`/school/${id}`);
    return response.data;
  }

  async create(school: Omit<School, 'id'>) {
    const response = await axiosClient.post('/school', school);
    return response.data;
  }

  async update(id: number, school: Partial<Omit<School, 'id'>>) {
    const response = await axiosClient.put(`/school/${id}`, school);
    return response.data;
  }

  async delete(id: number) {
    await axiosClient.delete(`/school/${id}`);
  }
}

export default new SchoolService();
