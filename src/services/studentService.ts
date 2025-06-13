/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../utils/axiosClient';

class StudentService {
    async getStudent(
        page: number = 1,
        perPage: number = 10,
        classGroupId?: string | number,
        search?: string,
        filters?: Record<string, any>,
        schoolId?: string | number
    ) {
        try {
            const params: Record<string, any> = { page, perPage, class_group_id: classGroupId, search, 'school_id': schoolId };

            if (filters) {
                Object.entries(filters).forEach(([key, filter]) => {
                    if (filter?.value !== undefined && filter?.value !== null) {
                        params[`filter[${key}]`] = filter.value;
                    }
                });
            }

            const response = await axiosClient.get(`/student`, { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching students", error);
            throw error;
        }
    }

    async addStudent(payload: any) {
        try {
            const response = await axiosClient.post(`/student`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error adding students`, error);
            throw error;
        }
    }

    async storeViaFile(payload: any) {
        const response = await axiosClient.post(`/student/store-via-file`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }


    async exportStudents() {
        try {
            const response = await axiosClient.get('/student/csv', {
                responseType: 'blob'
            });
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'students.csv';

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match?.[1]) {
                    fileName = match[1];
                }
            }
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting students', error);
            throw error;
        }
    }

    async updateStudent(schoolId: string | number, studentId: string | number, payload: any) {
        try {
            const updatedPayload = { ...payload, school_id: schoolId };
            const response = await axiosClient.put(`/student/${studentId}`, updatedPayload);
            return response.data;
        } catch (error) {
            console.error(`Error updating students for student id: ${schoolId}`, error);
            throw error;
        }
    }

    async deleteStudent(studentId: string | number) {
        try {
            const response = await axiosClient.delete(`/student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting students for student id: ${studentId}`, error);
            throw error;
        }
    }
}

export default new StudentService();
