export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface TaskAttachment {
  url: string
  mimeType: string
  size: number
}
