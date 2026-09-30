import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { addProjectMember,getProjectMembers,removeProjectMember,updateMemberRole,type MemberRole,type ProjectMember } from "../../api/member.api";
import { useProjectRole } from "../../hooks/useProjectRole";

const roles:MemberRole[]=["project_admin","member"];
export default function ProjectMembers(){
 const {projectId}=useParams<{projectId:string}>(); const {isAdmin}=useProjectRole(projectId);
 const [members,setMembers]=useState<ProjectMember[]>([]);const [email,setEmail]=useState("");const [role,setRole]=useState<MemberRole>("member");const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState("");
 const load=async()=>{if(!projectId)return;try{const r=await getProjectMembers(projectId);setMembers(r.data??r);}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to load project members");}finally{setLoading(false);}};
 useEffect(()=>{void load();},[projectId]);
 const add=async(e:FormEvent)=>{e.preventDefault();if(!projectId)return;setSaving(true);try{await addProjectMember(projectId,{email,role});setEmail("");setRole("member");await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to add member");}finally{setSaving(false);}};
 const change=async(id:string,r:MemberRole)=>{try{await updateMemberRole(projectId!,id,r);await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to update member role");}};
 const remove=async(id:string)=>{if(!projectId||!window.confirm("Remove this member from the project?"))return;try{await removeProjectMember(projectId,id);await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to remove member");}};
 return <main className="page"><Link to={`/projects/${projectId}`}>← Project</Link><div className="page-header"><div><h1>Project Members</h1><p>People and roles assigned to this project.</p></div></div>{error&&<div className="error">{error}</div>}
 {isAdmin&&<form className="member-form" onSubmit={add}><h2>Add member</h2><div className="member-form-fields"><input type="email" placeholder="User email" value={email} onChange={e=>setEmail(e.target.value)} required/><select value={role} onChange={e=>setRole(e.target.value as MemberRole)}>{roles.map(r=><option key={r} value={r}>{r==="project_admin"?"Project Admin":"Member"}</option>)}</select><button disabled={saving}>{saving?"Adding...":"Add member"}</button></div></form>}
 {loading?<p>Loading members...</p>:members.length===0?<div className="empty-state"><h2>No members found</h2></div>:<div className="member-list">{members.map((m,i)=>{const u=m.user;const id=u?._id;return <div className="member-card" key={id||m._id||i}><div className="member-avatar">{(u?.fullName||u?.username||u?.email||"?").charAt(0).toUpperCase()}</div><div className="member-info"><strong>{u?.fullName||u?.username||"Unnamed user"}</strong><span>{u?.email||u?.username||"No email available"}</span></div><span className={`role-badge role-${m.role}`}>{m.role==="project_admin"?"Project Admin":m.role}</span>{isAdmin&&id&&m.role!=="admin"&&<div className="member-actions"><select value={m.role} onChange={e=>void change(id,e.target.value as MemberRole)}><option value="project_admin">Project Admin</option><option value="member">Member</option></select><button className="danger-button" type="button" onClick={()=>void remove(id)}>Remove</button></div>}</div>})}</div>}
 </main>;
}
