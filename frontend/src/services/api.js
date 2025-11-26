import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kramik_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('kramik_token')
      window.location.href = '/login'
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    // Preserve original metadata so callers can inspect status/body
    error.message = message
    return Promise.reject(error)
  }
)

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  blockchainLogin: (data) => api.post('/auth/blockchain-login', data),
  verifyToken: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
}

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  updateSkills: (skills) => api.patch('/students/skills', { skills }),
  uploadProfileImage: (formData) => api.post('/students/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAssignments: () => api.get('/students/assignments'),
  markAssignmentComplete: (assignmentId) => api.post(`/students/assignments/${assignmentId}/complete`),
  getSchedule: () => api.get('/students/schedule'),
  markScheduleComplete: (scheduleId) => api.post(`/students/schedule/${scheduleId}/complete`),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  getUsers: (params) => api.get('/admin/users', { params }),
  createSubject: (data) => api.post('/admin/subjects', data),
  updateSubject: (id, data) => api.put(`/admin/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/admin/subjects/${id}`),
  getAssignments: () => api.get('/admin/assignments'),
  createAssignment: (data) => api.post('/admin/assignments', data),
  createAssignmentWithFile: (formData) => api.post('/admin/assignments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateAssignment: (id, data) => api.put(`/admin/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/admin/assignments/${id}`),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getSchedule: () => api.get('/admin/schedule'),
  createScheduleEntry: (data) => api.post('/admin/schedule', data),
  updateScheduleEntry: (id, data) => api.put(`/admin/schedule/${id}`, data),
  deleteScheduleEntry: (id) => api.delete(`/admin/schedule/${id}`),
}

export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  getByCategory: (category) => api.get(`/subjects/category/${category}`),
  getBySemester: (semester) => api.get(`/subjects/semester/${semester}`),
  search: (query) => api.get(`/subjects/search?q=${query}`),
}

export const geminiAPI = {
  getStudyAdvice: (data) => api.post('/gemini/study-advice', data),
  analyzeSubject: (data) => api.post('/gemini/analyze-subject', data),
  generateProjectIdeas: (data) => api.post('/gemini/project-ideas', data),
}

export default api