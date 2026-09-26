export type UserRole = 'admin' | 'project_admin' | 'member'

export interface User {
  _id: string
  username: string
  email: string
  fullName?: string
  avatar?: string
  role: UserRole
}
