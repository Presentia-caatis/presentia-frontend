/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

const dashboardService = {
  getStaticStatistics: async (schoolId: number) => {
    try {
      const response = await axiosClient.get(`/${schoolId}/dashboard-statistic/static`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getDailyStatistics: async (schoolId: number, date: string) => {
    try {
      const response = await axiosClient.post(`/${schoolId}/dashboard-statistic/daily`, {
        date,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default dashboardService;