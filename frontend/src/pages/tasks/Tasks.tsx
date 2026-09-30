import { useCallback,useEffect,useState } from "react";
import type { FormEvent } from "react";
import { Link,useParams } from "react-router-dom";
import { createTask,deleteTask,getTasks,type Task } from "../../api/task.api";
import type { TaskStatus } from "../../types/task";
import { useProjectRole } from "../../hooks/useProjectRole";
import { getProjectMembers,type ProjectMember } from "../../api/member.api";

const statuses:TaskStatus[]=["todo","in_progress","done"];
export default function Tasks(){
 const {projectId}=useParams<{projectId:string}>();const {isProjectAdmin}=useProjectRole(projectId);
 const [tasks,setTasks]=useState<Task[]>([]);const [members,setMembers]=useState<ProjectMember[]>([]);const [title,setTitle]=useState("");const [description,setDescription]=useState("");const [status,setStatus]=useState<TaskStatus>("todo");const [assignedTo,setAssignedTo]=useState("");const [files,setFiles]=useState<File[]>([]);const [error,setError]=useState("");const [loading,setLoading]=useState(true);const [creating,setCreating]=useState(false);
 const load=useCallback(async()=>{if(!projectId)return;try{const r=await getTasks(projectId);setTasks(r.data??r);}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to load tasks");}finally{setLoading(false);}},[projectId]);
 useEffect(()=>{void load();if(projectId)getProjectMembers(projectId).then(r=>setMembers(r.data??r)).catch(()=>setMembers([]));},[load,projectId]);
 const submit=async(e:FormEvent)=>{e.preventDefault();if(!projectId)return;setCreating(true);try{const form=new FormData();form.append("title",title);if(description)form.append("description",description);form.append("status",status);if(assignedTo)form.append("assignedTo",assignedTo);files.forEach(f=>form.append("attachments",f));await createTask(projectId,form);setTitle("");setDescription("");setStatus("todo");setAssignedTo("");setFiles([]);await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to create task");}finally{setCreating(false);}};
 const remove=async(id:string)=>{if(!projectId||!window.confirm("Delete this task?"))return;try{await deleteTask(projectId,id);await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to delete task");}};
 return <main className="page"><Link to={`/projects/${projectId}`}>← Project</Link><div className="page-header"><div><h1>Tasks</h1><p>Tasks for this project.</p></div></div>{error&&<div className="error">{error}</div>}
 {isProjectAdmin&&<form className="task-form" onSubmit={submit}><h2>Create task</h2><input placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} required/><textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} rows={3}/><div className="task-form-row"><select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)}><option value="">Unassigned</option>{members.map(m=>m.user&&<option key={m.user._id} value={m.user._id}>{m.user.fullName||m.user.username||m.user.email}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value as TaskStatus)}>{statuses.map(s=><option key={s} value={s}>{s.replace("_"," ")}</option>)}</select><input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))}/></div><button disabled={creating}>{creating?"Creating...":"Create task"}</button></form>}
 {loading?<p>Loading tasks...</p>:tasks.length===0?<div className="empty-state"><h2>No tasks</h2></div>:<div className="task-list">{tasks.map(t=><article className="task-card" key={t._id}><div><span className={`status-badge status-${t.status}`}>{t.status.replace("_"," ")}</span><h2>{t.title}</h2><p>{t.description||"No description"}</p>{t.attachments?.length&&<small>{t.attachments.length} attachment(s)</small>}</div><div className="task-actions"><Link to={`/projects/${projectId}/tasks/${t._id}`}>Open</Link>{isProjectAdmin&&<button className="danger-button" onClick={()=>void remove(t._id)}>Delete</button>}</div></article>)}</div>}
 </main>;
}
