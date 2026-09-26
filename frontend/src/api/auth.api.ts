import { api } from './axios'

export interface RegisterPayload { username: string; email: string; fullName: string; password: string }
export interface LoginPayload { email: string; password: string }

export const registerUser = async (data: RegisterPayload) => (await api.post('/auth/register', data)).data
export const loginUser = async (data: LoginPayload) => (await api.post('/auth/login', data)).data
export const logoutUser = async () => (await api.post('/auth/logout')).data
export const getCurrentUser = async () => (await api.get('/auth/current-user')).data
export const changePassword = async (data: { oldPassword: string; newPassword: string }) => (await api.post('/auth/change-password', data)).data
export const forgotPassword = async (email: string) => (await api.post('/auth/forgot-password', { email })).data
export const resetPassword = async (resetToken: string, password: string) => (await api.post(`/auth/reset-password/${resetToken}`, { password })).data
export const resendEmailVerification = async () => (await api.post('/auth/resend-email-verification')).data
