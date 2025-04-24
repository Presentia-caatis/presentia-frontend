/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';
export interface ManualAttendancePayload {
    attendance_window_id: number;
    student_id: number;
    absence_permit_id?: number | null;
    check_in_time?: string | null; // format: 'YYYY-MM-DD HH:mm:ss'
    check_out_time?: string | null;
    check_out_status_id?: number | null;
    check_in_status_id?: number | null;
}

class AttendanceService {
    async getAttendances(params = {}) {
        try {
            const response = await axiosClient.get(`/attendance`, { params });
            return response.data;
        } catch (error) {
            console.error(`There was an error fetching the attendances`, error);
            throw error;
        }
    }
    async updateAttendance(id: number, data: any) {
        try {
            const response = await axiosClient.put(`/attendance/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating attendance:', error);
            throw error;
        }
    }

    async manualAttendance(nis: number) {
        try {
            const response = await axiosClient.post('/attendance/manual/nis', { nis });
            return response.data;
        } catch (error: any) {
            console.error('Error manual attendance:', error);
            throw error?.response?.data || error;
        }
    }


    async exportAttendance(params = {}) {
        try {
            const response = await axiosClient.get('/attendance/export', {
                params,
                responseType: 'blob'
            });
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'attendance_export.xlsx';

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match?.[1]) {
                    fileName = match[1].replace(/"/g, '');
                }
            }

            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting attendance:', error);
            throw error;
        }
    }
}

export default new AttendanceService();
