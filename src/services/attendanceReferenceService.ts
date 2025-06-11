/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class AttendanceReferenceService {
    async getAttendanceReferences(schoolId?: string): Promise<any> {
        return axiosClient.get(`attendance-references`, {
            headers: {
                ...(schoolId ? { 'School-Id': schoolId } : {})
            }
        });
    }
}

export default new AttendanceReferenceService();
