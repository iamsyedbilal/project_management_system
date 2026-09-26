export type ProjectRole = 'admin' | 'project_admin' | 'member'

export interface Project {
  _id: string
  name: string
  description?: string
}
