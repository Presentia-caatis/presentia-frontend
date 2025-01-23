import axiosClient from '../utils/axiosClient';

class AttendanceService {
    getAttendances(schoolId: number) {
        return axiosClient.get(`/${schoolId}/attendance`)
            .then(response => response.data)
            .catch(error => {
                console.error(`There was an error fetching the attendances for school_id: ${schoolId}`, error);
                throw error;
            });
    }
}

export default new AttendanceService();
