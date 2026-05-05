import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// User API
export const userAPI = {
    register: (userData) => apiClient.post('/users/register', userData),
    login: (credentials) => apiClient.post('/users/login', credentials),
    getProfile: (userId) => apiClient.get(`/users/profile/${userId}`),
    updateProfile: (userId, data) => apiClient.put(`/users/profile/${userId}`, data),
    getStats: (userId) => apiClient.get(`/users/stats/${userId}`),
    getAllUsers: (limit = 10, page = 1) => apiClient.get('/users', { params: { limit, page } })
};

// Device API
export const deviceAPI = {
    createDevice: (userId, deviceData) => apiClient.post(`/devices/${userId}/devices`, deviceData),
    getDevices: (userId, limit = 10, page = 1) =>
        apiClient.get(`/devices/${userId}/devices`, { params: { limit, page } }),
    getDevice: (deviceId) => apiClient.get(`/devices/devices/${deviceId}`),
    updateDevice: (deviceId, data) => apiClient.put(`/devices/devices/${deviceId}`, data),
    deleteDevice: (deviceId) => apiClient.delete(`/devices/devices/${deviceId}`),
    updateStatus: (deviceId, status) => apiClient.patch(`/devices/devices/${deviceId}/status`, { status }),
    getStats: (deviceId) => apiClient.get(`/devices/devices/${deviceId}/stats`)
};

// Consumption API
export const consumptionAPI = {
    record: (userId, deviceId, data) =>
        apiClient.post(`/consumption/${userId}/devices/${deviceId}/consumption`, data),
    getUserConsumption: (userId, startDate, endDate, limit = 100, page = 1) =>
        apiClient.get(`/consumption/${userId}/consumption`, {
            params: { startDate, endDate, limit, page }
        }),
    getConsumptionWithAlerts: (userId, limit = 10, page = 1) =>
        apiClient.get(`/consumption/${userId}/consumption-with-alerts`, {
            params: { limit, page }
        }),
    getDeviceConsumption: (userId, deviceId, startDate, endDate, limit = 100, page = 1) =>
        apiClient.get(`/consumption/${userId}/devices/${deviceId}/consumption`, {
            params: { startDate, endDate, limit, page }
        }),
    getDailyConsumption: (userId, date) =>
        apiClient.get(`/consumption/${userId}/consumption/daily`, { params: { date } }),
    getMonthlyConsumption: (userId, year, month) =>
        apiClient.get(`/consumption/${userId}/consumption/monthly`, { params: { year, month } }),
    getHourlyConsumption: (userId, date) =>
        apiClient.get(`/consumption/${userId}/consumption/hourly`, { params: { date } }),
    getTrend: (userId, days = 30) =>
        apiClient.get(`/consumption/${userId}/consumption/trend`, { params: { days } }),
    getComparison: (userId) =>
        apiClient.get(`/consumption/${userId}/devices/comparison`),
    seedDemoData: (userId) =>
        apiClient.post(`/consumption/${userId}/demo-data/seed`),
    clearDemoData: (userId) =>
        apiClient.delete(`/consumption/${userId}/demo-data/clear`)
};

// Alert API
export const alertAPI = {
    createThreshold: (userId, data) => apiClient.post(`/alerts/${userId}/thresholds`, data),
    getThresholds: (userId) => apiClient.get(`/alerts/${userId}/thresholds`),
    updateThreshold: (thresholdId, data) => apiClient.put(`/alerts/thresholds/${thresholdId}`, data),
    deleteThreshold: (thresholdId) => apiClient.delete(`/alerts/thresholds/${thresholdId}`),
    createAlert: (userId, data) => apiClient.post(`/alerts/${userId}/alerts`, data),
    getAlerts: (userId, limit = 50, page = 1, isResolved = null) => {
        const params = { limit, page };
        if (isResolved !== null) params.isResolved = isResolved;
        return apiClient.get(`/alerts/${userId}/alerts`, { params });
    },
    getUnresolved: (userId) => apiClient.get(`/alerts/${userId}/alerts/unresolved`),
    resolveAlert: (alertId, userId, notes = '') =>
        apiClient.put(`/alerts/alerts/${alertId}/resolve`, { resolutionNotes: notes }),
    getStats: (userId) => apiClient.get(`/alerts/${userId}/alerts/stats`)
};

// Report API
export const reportAPI = {
    getDailyReport: (userId, date) =>
        apiClient.get(`/reports/${userId}/daily`, { params: { date } }),
    getMonthlyReport: (userId, year, month) =>
        apiClient.get(`/reports/${userId}/monthly`, { params: { year, month } }),
    getYearlyReport: (userId, year) =>
        apiClient.get(`/reports/${userId}/yearly`, { params: { year } }),
    getComparisonReport: (userId, startDate, endDate) =>
        apiClient.get(`/reports/${userId}/comparison`, { params: { startDate, endDate } }),
    getInsights: (userId) =>
        apiClient.get(`/reports/${userId}/insights`)
};

export default apiClient;
