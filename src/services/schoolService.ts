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
}

class SchoolService {
  async getAll(): Promise<School[]> {
    const response = await axiosClient.get<School[]>('/school');
    return response.data;
  }

  async getById(id: number): Promise<School> {
    const response = await axiosClient.get<School>(`/school/${id}`);
    return response.data;
  }

  async create(school: Omit<School, 'id'>): Promise<School> {
    const response = await axiosClient.post<School>('/school', school);
    return response.data;
  }

  async update(id: number, school: Partial<Omit<School, 'id'>>): Promise<School> {
    const response = await axiosClient.put<School>(`/school/${id}`, school);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/school/${id}`);
  }
}

export default new SchoolService();
