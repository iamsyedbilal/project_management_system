import { FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addProjectMember, getProjectMembers, removeProjectMember, updateMemberRole, type MemberRole, type ProjectMember } from '../../api/member.api'

const roles: MemberRole[] = ['project_admin', 'member']

export default function ProjectMembers() {
  const { projectId } = useParams<{ projectId: string }>()
  const [members, setMembers] = useState<ProjectMember[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!projectId) return
    try {
      const response = await getProjectMembers(projectId)
      setMembers(response.data ?? response)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to load project members')
    } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [projectId])

  const addMember = async (event: FormEvent) => {
    event.preventDefault()
    if (!projectId) return
    setSaving(true); setError('')
    try {
      await addProjectMember(projectId, { email, role })
      setEmail('')
      setRole('member')
      await load()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to add member')
    } finally { setSaving(false) }
  }

  const changeRole = async (userId: string, nextRole: MemberRole) => {
    if (!projectId) return
    try {
      await updateMemberRole(projectId, userId, nextRole)
      await load()
    } catch (err: any) { setError(err.response?.data?.message || 'Unable to update member role') }
  }

  const remove = async (userId: string) => {
    if (!projectId || !window.confirm('Remove this member from the project?')) return
    try {
      await removeProjectMember(projectId, userId)
      await load()
    } catch (err: any) { setError(err.response?.data?.message || 'Unable to remove member') }
  }

  return <main className="page">
    <Link to={`/projects/${projectId}`}>← Project</Link>
    <div className="page-header members-header"><div><h1>Project Members</h1><p>Manage the people and roles assigned to this project.</p></div></div>

    {error && <div className="error">{error}</div>}

    <form className="member-form" onSubmit={addMember}>
      <h2>Add member</h2>
      <div className="member-form-fields">
        <input type="email" placeholder="User email" value={email} onChange={e => setEmail(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value as MemberRole)}>
          {roles.map(item => <option value={item} key={item}>{item === 'project_admin' ? 'Project Admin' : 'Member'}</option>)}
        </select>
        <button disabled={saving}>{saving ? 'Adding...' : 'Add member'}</button>
      </div>
    </form>

    {loading ? <p>Loading members...</p> : members.length === 0 ? <div className="empty-state"><h2>No members found</h2><p>This project has no additional members yet.</p></div> : <div className="member-list">
      {members.map((member, index) => {
        const user = member.user
        const userId = user?._id
        return <div className="member-card" key={userId || member._id || index}>
          <div className="member-avatar">{(user?.fullName || user?.username || user?.email || '?').charAt(0).toUpperCase()}</div>
          <div className="member-info">
            <strong>{user?.fullName || user?.username || 'Unnamed user'}</strong>
            <span>{user?.email || user?.username || 'No email available'}</span>
          </div>
          <span className={`role-badge role-${member.role}`}>{member.role === 'project_admin' ? 'Project Admin' : member.role}</span>
          {userId && <div className="member-actions">
            <select value={member.role} onChange={e => void changeRole(userId, e.target.value as MemberRole)} disabled={member.role === 'admin'}>
              <option value="project_admin">Project Admin</option>
              <option value="member">Member</option>
            </select>
            {member.role !== 'admin' && <button className="danger-button" type="button" onClick={() => void remove(userId)}>Remove</button>}
          </div>}
        </div>
      })}
    </div>}
  </main>
}
