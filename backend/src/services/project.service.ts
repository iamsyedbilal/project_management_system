import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import ProjectMember from '../models/projectMember.model.js';
import type { CreateProjectServiceParams } from '../types/project.type.js';
import ApiError from '../utils/apiError.js';
import { UserRole } from '../utils/constants.js';

export const listUserProjectsService = async () => {};

export const createProjectService = async ({ data, userId }: CreateProjectServiceParams) => {
  const project = await Project.create({
    name: data.name,
    description: data.description ?? '',
    owner: userId,
  });

  if (!project) {
    throw new ApiError(400, 'Something went wrong while creating the project');
  }

  await ProjectMember.create({
    project: new mongoose.Types.ObjectId(project._id),
    user: new mongoose.Types.ObjectId(userId),
    role: UserRole.ADMIN,
  });

  return project;
};

export const getProjectDetailsService = async (projectId: string) => {
  const project = Project.findById(projectId);
  if (!project) {
    throw new ApiError(400, 'Project not found');
  }
  return project;
};

export const updateProjectService = async (
  projectId: string,
  { name, description }: { name?: string; description?: string },
) => {
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );

  if (!updatedProject) {
    throw new ApiError(400, 'Project not found');
  }

  return updatedProject;
};

export const deleteProjectService = async (projectId: string) => {
  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
};

export const listProjectMembersService = async () => {};

export const addProjectMemberService = async () => {};

export const updateMemberRoleService = async () => {};

export const removeMemberService = async () => {};
