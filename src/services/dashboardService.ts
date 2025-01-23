/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

const dashboardService = {
  /**
   * Fetch static dashboard statistics
   * @param schoolId - ID of the school
   * @returns Promise with static statistics data
   */
  getStaticStatistics: async (schoolId: number) => {
    try {
      const response = await axiosClient.get(`/${schoolId}/dashboard-statistic/static`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch daily statistics
   * @param schoolId - ID of the school
   * @param date - Date for the daily statistics in 'YYYY-MM-DD' format
   * @returns Promise with daily statistics data
   */
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