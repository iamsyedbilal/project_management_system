import { api } from "./axios";

export type MemberRole = "admin" | "project_admin" | "member";

export interface ProjectMember {
  _id?: string;
  user?: {
    _id: string;
    username?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  };
  role: MemberRole;
  createdAt?: string;
}

export const getProjectMembers = async (projectId: string) =>
  (await api.get(`/projects/${projectId}/members`)).data;
export const addProjectMember = async (
  projectId: string,
  data: { email: string; role: MemberRole },
) => (await api.post(`/projects/${projectId}/members`, data)).data;
export const updateMemberRole = async (
  projectId: string,
  userId: string,
  role: MemberRole,
) => (await api.put(`/projects/${projectId}/members/${userId}`, { role })).data;
export const removeProjectMember = async (projectId: string, userId: string) =>
  (await api.delete(`/projects/${projectId}/members/${userId}`)).data;
