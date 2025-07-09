/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';
class RoleService {
  async getSchoolRole(params = {}) {
    const response = await axiosClient.get(`/role/school`, params);
    return response.data.data.data;
  }

  async changeUserRole(params = {}) {
    const response = await axiosClient.post(`/role/user/assign`, params);
    return response;
  }

}

export default new RoleService();
