import { api } from "./axios";

export const getProjects = async () => (await api.get("/projects")).data;

export const getProject = async (projectId: string) =>
  (await api.get(`/projects/${projectId}`)).data;

export const createProject = async (data: {
  name: string;
  description?: string;
}) => (await api.post("/projects", data)).data;
