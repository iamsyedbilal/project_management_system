import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import ProjectMember from '../models/projectMember.model.js';
import User from '../models/user.model.js';
import type {
  AddProjectMemberInput,
  CreateProjectInput,
  UpdateProjectInput,
  UpdateMemberRoleInput,
} from '../validators/project.validator.js';
import type { CreateProjectServiceParams } from '../types/project.type.js';
import ApiError from '../utils/apiError.js';
import { UserRole } from '../utils/constants.js';

const getObjectId = (id: string, fieldName: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }

  return new mongoose.Types.ObjectId(id);
};

export const listUserProjectsService = async (userId: string | mongoose.Types.ObjectId) => {
  const userObjectId =
    typeof userId === 'string' ? getObjectId(userId, 'user ID') : userId;

  const memberships = await ProjectMember.find({ user: userObjectId })
    .select('project role')
    .lean();

  if (memberships.length === 0) {
    return [];
  }

  const projectIds = memberships.map((membership) => membership.project);
  const projects = await Project.find({ _id: { $in: projectIds } }).lean();

  const memberCounts = await ProjectMember.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$project', count: { $sum: 1 } } },
  ]);

  const countMap = new Map(memberCounts.map((item) => [item._id.toString(), item.count]));
  const roleMap = new Map(memberships.map((item) => [item.project.toString(), item.role]));

  return projects.map((project) => ({
    ...project,
    role: roleMap.get(project._id.toString()),
    memberCount: countMap.get(project._id.toString()) ?? 0,
  }));
};

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
    project: project._id,
    user: userId,
    role: UserRole.ADMIN,
  });

  return project;
};

export const getProjectDetailsService = async (projectId: string) => {
  const projectObjectId = getObjectId(projectId, 'project ID');
  const project = await Project.findById(projectObjectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return project;
};

export const updateProjectService = async (
  projectId: string,
  data: UpdateProjectInput,
) => {
  const projectObjectId = getObjectId(projectId, 'project ID');

  const updatedProject = await Project.findByIdAndUpdate(
    projectObjectId,
    { $set: data },
    { new: true, runValidators: true },
  );

  if (!updatedProject) {
    throw new ApiError(404, 'Project not found');
  }

  return updatedProject;
};

export const deleteProjectService = async (projectId: string) => {
  const projectObjectId = getObjectId(projectId, 'project ID');
  const project = await Project.findByIdAndDelete(projectObjectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  await ProjectMember.deleteMany({ project: projectObjectId });
};

export const listProjectMembersService = async (projectId: string) => {
  const projectObjectId = getObjectId(projectId, 'project ID');

  const projectExists = await Project.exists({ _id: projectObjectId });
  if (!projectExists) {
    throw new ApiError(404, 'Project not found');
  }

  return ProjectMember.find({ project: projectObjectId })
    .select('-_id project user role createdAt updatedAt')
    .populate('user', 'username email fullName avatar')
    .lean();
};

export const addProjectMemberService = async (
  projectId: string,
  data: AddProjectMemberInput,
) => {
  const projectObjectId = getObjectId(projectId, 'project ID');

  const projectExists = await Project.exists({ _id: projectObjectId });
  if (!projectExists) {
    throw new ApiError(404, 'Project not found');
  }

  const user = await User.findOne({ email: data.email.toLowerCase() }).select(
    '_id isEmailVerified',
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, 'User must be verified before being added to a project');
  }

  const existingMember = await ProjectMember.exists({
    project: projectObjectId,
    user: user._id,
  });

  if (existingMember) {
    throw new ApiError(409, 'User is already a member of this project');
  }

  const projectMember = await ProjectMember.create({
    project: projectObjectId,
    user: user._id,
    role: UserRole.MEMBER,
  });

  return ProjectMember.findById(projectMember._id)
    .select('-_id project user role createdAt updatedAt')
    .populate('user', 'username email fullName avatar')
    .lean();
};

export const updateMemberRoleService = async (
  projectId: string,
  userId: string,
  data: UpdateMemberRoleInput,
) => {
  const projectObjectId = getObjectId(projectId, 'project ID');
  const userObjectId = getObjectId(userId, 'user ID');

  const updatedMember = await ProjectMember.findOneAndUpdate(
    { project: projectObjectId, user: userObjectId },
    { $set: { role: data.role } },
    { new: true, runValidators: true },
  )
    .select('-_id project user role createdAt updatedAt')
    .populate('user', 'username email fullName avatar')
    .lean();

  if (!updatedMember) {
    throw new ApiError(404, 'Project member not found');
  }

  return updatedMember;
};

export const removeMemberService = async (projectId: string, userId: string) => {
  const projectObjectId = getObjectId(projectId, 'project ID');
  const userObjectId = getObjectId(userId, 'user ID');

  const removedMember = await ProjectMember.findOneAndDelete({
    project: projectObjectId,
    user: userObjectId,
  });

  if (!removedMember) {
    throw new ApiError(404, 'Project member not found');
  }
};
