import axiosClient from '../utils/axiosClient';

class AttendanceService {
    getAttendances() {
        return axiosClient.get('/attendance')
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error fetching the attendances!', error);
                throw error;
            });
    }
}

export default new AttendanceService();
