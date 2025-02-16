/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class AttendanceService {
    getAttendances(params = {}) {
        return axiosClient.get(`/attendance`, { params })
            .then(response => response.data)
            .catch((error: any) => {
                console.error(`There was an error fetching the attendances`, error);
                throw error;
            });
    }
    async exportAttendance(params = {}) {
        try {
            const response = await axiosClient.get('/attendance/export-attendance', {
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
