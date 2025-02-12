import axiosClient from '../utils/axiosClient';

class AttendanceService {
    getAttendances(params = {}) {
        return axiosClient.get(`/attendance`, { params })
            .then(response => response.data)
            .catch(error => {
                console.error(`There was an error fetching the attendances`, error);
                throw error;
            });
    }
}

export default new AttendanceService();
