/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

interface AttendanceScheduleData {
    name: string;
    type: 'event' | 'default' | 'holiday';
    check_in_start_time: string;
    check_in_end_time: string;
    check_out_start_time: string;
    check_out_end_time: string;
}

class AttendanceScheduleService {

    async getSchedule(type: 'default' | 'event' | 'holiday'): Promise<any> {
        return axiosClient.get(`attendance-schedule`, {
            params: {
                'filter[type]': type
            }
        });
    }



    async updateSchedule(id: number, data: AttendanceScheduleData): Promise<any> {
        return axiosClient.put(`attendance-schedule/${id}`, data);
    }
}

export default new AttendanceScheduleService();
