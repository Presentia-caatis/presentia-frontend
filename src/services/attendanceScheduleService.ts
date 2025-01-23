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

    async showScheduleByType(schoolId: number, data: any): Promise<any> {
        return axiosClient.post(`${schoolId}/attendance-schedule/show-by-type`, data);
    }

    async updateSchedule(schoolId: number, id: number, data: AttendanceScheduleData): Promise<any> {
        return axiosClient.put(`${schoolId}/attendance-schedule/${id}`, data);
    }
}

export default new AttendanceScheduleService();
