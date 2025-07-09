/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

export interface SchoolResponse {
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

export interface CreateSchoolPayload {
  name: string;
  address: string;
  timezone: string;
  user_id: number;
  logo_image?: File;
}

class SchoolService {
  async getAll(perPage = 10, page = 1) {
    const response = await axiosClient.get(`/school?perPage=${perPage}&page=${page}`);
    return response.data;
  }

  async getSchoolByName(schoolName: string) {
    const response = await axiosClient.get(`/school/by-name/${schoolName}`)
    return response.data;
  }

  async getById(id: number) {
    const response = await axiosClient.get(`/school/${id}`);
    return response.data;
  }

  async create(payload: CreateSchoolPayload) {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('address', payload.address);
    formData.append('timezone', payload.timezone);
    formData.append('user_id', String(payload.user_id));
    if (payload.logo_image) {
      formData.append('logo_image', payload.logo_image);
    }

    const { data } = await axiosClient.post('/school', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data as SchoolResponse;
  }

  async update(id: number, school: FormData) {
    const response = await axiosClient.post(`/school/${id}`, school, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: {
        _method: 'PUT'
      }
    });
    return response.data;
  }

  async delete(id: number) {
    await axiosClient.delete(`/school/${id}`);
  }
}

export default new SchoolService();
