/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

const dashboardService = {
  getStaticStatistics: async () => {
    try {
      const response = await axiosClient.get(`/dashboard-statistic/static`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getDailyStatistics: async (date: string) => {
    try {
      const response = await axiosClient.post(`/dashboard-statistic/daily`, {
        date,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default dashboardService;