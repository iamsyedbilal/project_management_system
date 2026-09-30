import { api } from "./axios";

export interface Note {
  _id: string;
  title: string;
  content: string;
  project?: string;
  createdAt?: string;
  updatedAt?: string;
}
export const getNotes = async (projectId: string) =>
  (await api.get(`/notes/${projectId}`)).data;
export const getNote = async (projectId: string, noteId: string) =>
  (await api.get(`/notes/${projectId}/n/${noteId}`)).data;
export const createNote = async (
  projectId: string,
  data: { title: string; content: string },
) => (await api.post(`/notes/${projectId}`, data)).data;
export const updateNote = async (
  projectId: string,
  noteId: string,
  data: { title?: string; content?: string },
) => (await api.put(`/notes/${projectId}/n/${noteId}`, data)).data;
export const deleteNote = async (projectId: string, noteId: string) =>
  (await api.delete(`/notes/${projectId}/n/${noteId}`)).data;
