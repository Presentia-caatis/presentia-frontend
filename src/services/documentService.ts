import axiosClient from '../utils/axiosClient';

class DocumentService {
    async getAllDocuments(perPage = 10, filter = {}) {
        const response = await axiosClient.get('/document', {
            params: { perPage, filter },
        });
        return response.data;
    }
    async getDocumentById(id: number) {
        const response = await axiosClient.get(`/document/${id}`);
        return response.data;
    }
    async createDocument(document_name: string, file: File) {
        const formData = new FormData();
        formData.append('document_name', document_name);
        formData.append('file', file);

        const response = await axiosClient.post('/document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
    async updateDocument(id: number, document_name?: string, file?: File) {
        const formData = new FormData();
        if (document_name) formData.append('document_name', document_name);
        if (file) formData.append('file', file);

        const response = await axiosClient.put(`/document/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
    async deleteDocument(id: number) {
        const response = await axiosClient.delete(`/document/${id}`);
        return response.data;
    }
}

export default new DocumentService();
