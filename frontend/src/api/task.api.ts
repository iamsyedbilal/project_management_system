import { api } from './axios'
import type { TaskStatus } from '../types/task'

export interface Task {
  _id: string
  title: string
  description?: string
  project?: string
  assignedTo?: { _id: string; username?: string; fullName?: string; email?: string } | string
  status: TaskStatus
  attachments?: { url: string; mimeType: string; size: number }[]
  subtasks?: SubTask[]
  createdAt?: string
  updatedAt?: string
}

export interface SubTask {
  _id: string
  title: string
  description?: string
  status?: TaskStatus | 'todo' | 'done'
  completed?: boolean
  assignedTo?: string | { _id: string; username?: string; fullName?: string }
}

export const getTasks = async (projectId: string) => (await api.get(`/tasks/${projectId}`)).data
export const getTask = async (projectId: string, taskId: string) => (await api.get(`/tasks/${projectId}/t/${taskId}`)).data
export const createTask = async (projectId: string, data: FormData) => (await api.post(`/tasks/${projectId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data
export const updateTask = async (projectId: string, taskId: string, data: Partial<{ title: string; description: string; assignedTo: string; status: TaskStatus }>) => (await api.put(`/tasks/${projectId}/t/${taskId}`, data)).data
export const deleteTask = async (projectId: string, taskId: string) => (await api.delete(`/tasks/${projectId}/t/${taskId}`)).data
export const createSubTask = async (projectId: string, taskId: string, data: { title: string; description?: string }) => (await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data)).data
export const updateSubTask = async (projectId: string, subTaskId: string, data: Record<string, unknown>) => (await api.put(`/tasks/${projectId}/st/${subTaskId}`, data)).data
export const deleteSubTask = async (projectId: string, subTaskId: string) => (await api.delete(`/tasks/${projectId}/st/${subTaskId}`)).data
