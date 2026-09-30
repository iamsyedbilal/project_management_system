import { FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createTask, deleteTask, getTasks, type Task } from '../../api/task.api'
import type { TaskStatus } from '../../types/task'

const statuses: TaskStatus[] = ['todo', 'in_progress', 'done']

export default function Tasks() {
  const { projectId } = useParams<{ projectId: string }>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    if (!projectId) return
    try { const response = await getTasks(projectId); setTasks(response.data ?? response) }
    catch (err: any) { setError(err.response?.data?.message || 'Unable to load tasks') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [projectId])

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!projectId) return
    setCreating(true); setError('')
    try {
      const form = new FormData()
      form.append('title', title)
      if (description) form.append('description', description)
      form.append('status', status)
      files.forEach(file => form.append('attachments', file))
      await createTask(projectId, form)
      setTitle(''); setDescription(''); setStatus('todo'); setFiles([])
      await load()
    } catch (err: any) { setError(err.response?.data?.message || 'Unable to create task') }
    finally { setCreating(false) }
  }

  const remove = async (taskId: string) => {
    if (!projectId || !window.confirm('Delete this task?')) return
    try { await deleteTask(projectId, taskId); await load() }
    catch (err: any) { setError(err.response?.data?.message || 'Unable to delete task') }
  }

  return <main className="page">
    <Link to={`/projects/${projectId}`}>← Project</Link>
    <div className="page-header"><div><h1>Tasks</h1><p>Create and manage tasks for this project.</p></div></div>
    {error && <div className="error">{error}</div>}
    <form className="task-form" onSubmit={submit}>
      <h2>Create task</h2>
      <input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      <div className="task-form-row"><select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>{statuses.map(item => <option key={item}>{item}</option>)}</select><input type="file" multiple onChange={e => setFiles(Array.from(e.target.files || []))}/></div>
      <button disabled={creating}>{creating ? 'Creating...' : 'Create task'}</button>
    </form>
    {loading ? <p>Loading tasks...</p> : tasks.length === 0 ? <div className="empty-state"><h2>No tasks</h2><p>Create the first task for this project.</p></div> : <div className="task-list">{tasks.map(task => <article className="task-card" key={task._id}><div><span className={`status-badge status-${task.status}`}>{task.status.replace('_',' ')}</span><h2>{task.title}</h2><p>{task.description || 'No description'}</p>{task.attachments?.length ? <small>{task.attachments.length} attachment(s)</small> : null}</div><div className="task-actions"><Link to={`/projects/${projectId}/tasks/${task._id}`}>Open</Link><button className="danger-button" onClick={() => void remove(task._id)}>Delete</button></div></article>)}</div>}
  </main>
}
