import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

export const getHabits = async ({ pageParam = 0 }) => {
    const limit = 10;
    const { data } = await api.get(`/habits/?skip=${pageParam}&limit=${limit}`);
    return data;
};

export const createHabit = async (habit) => {
    const { data } = await api.post('/habits/', habit);
    return data;
};

export const completeHabit = async (habitId, logData = null) => {
    const { data } = await api.post(`/habits/${habitId}/log`, logData);
    return data;
};

export const deleteHabit = async (id) => {
    const { data } = await api.delete(`/habits/${id}`);
    return data;
};

export const updateHabit = async ({ id, data }) => {
    const { data: res } = await api.put(`/habits/${id}`, data);
    return res;
};

// Auth
export const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Auth endpoint expects form-data
    const { data } = await api.post('/login/access-token', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Set token
    localStorage.setItem('token', data.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
    return data;
};

export const signup = async (userData) => {
    const { data } = await api.post('/users/', userData);
    return data;
};

export const getMe = async () => {
    const { data } = await api.get('/users/me');
    return data;
};

// Initialize token from storage
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
