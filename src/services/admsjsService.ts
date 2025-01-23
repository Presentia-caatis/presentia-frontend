import axios from 'axios';

const ADMSJSAPI = 'https://admsjs.presentia.matradipti.org';

const admsjsClient = axios.create({
    baseURL: ADMSJSAPI,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

admsjsClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admsjs_token');
        if (token && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginToADMSJS = async (username: string, password: string) => {
    try {
        const response = await admsjsClient.post('/api/login', { username, password });
        const token = response.data.data.token;
        return token;
    } catch (error) {
        console.error('Login ADMSJS failed:', error);
        throw error;
    }
};

export const logoutADMSJS = async () => {
    try {
        const response = await admsjsClient.get('/api/logout');
        if (response.data.error === "false") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error fetching fingerprint data:', error);
        return false;
    }
};

export const enrollFingerprint = async (studentId: string, fingerId: number, retry: number, machineNumber: string) => {
    try {
        await admsjsClient.post(`/adms/command?include=${machineNumber}`, {
            header: ['ENROLL_FP'],
            body: { PIN: studentId, FID: fingerId, RETRY: retry, OVERWRITE: 1 }
        });
        return { success: true };
    } catch (error) {
        console.error('Fingerprint registration failed:', error);
        throw error;
    }
};

export const getFingerprintData = async () => {
    try {
        const response = await admsjsClient.get('/adms/fingerprint');
        const data = response.data;
        if (data.error) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        console.error('Error fetching fingerprint data:', error);
        throw error;
    }
};


export default admsjsClient;
