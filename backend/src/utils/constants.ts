export const UserRole = {
  ADMIN: 'admin',
  PROJECT_ADMIN: 'project_admin',
  MEMBER: 'member',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export const AvailableUserRole: UserRoleType[] = Object.values(UserRole);

export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
} as const;

export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export const AvailableTasksStatus: TaskStatusType[] = Object.values(TaskStatus);
