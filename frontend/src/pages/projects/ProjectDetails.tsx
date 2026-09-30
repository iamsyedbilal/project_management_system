import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProject, getProject, updateProject } from "../../api/project.api";
import type { Project } from "../../types/project";
import { useProjectRole } from "../../hooks/useProjectRole";

export default function ProjectDetails() {
  const { projectId }=useParams<{projectId:string}>(); const navigate=useNavigate();
  const { isAdmin, loading: roleLoading }=useProjectRole(projectId);
  const [project,setProject]=useState<Project|null>(null); const [editing,setEditing]=useState(false); const [name,setName]=useState(""); const [description,setDescription]=useState(""); const [error,setError]=useState("");
  useEffect(()=>{if(!projectId)return;getProject(projectId).then(r=>{const p=r.data??r;setProject(p);setName(p.name||"");setDescription(p.description||"");}).catch(e=>setError(e.response?.data?.message||"Unable to load project"));},[projectId]);
  const save=async(e:React.FormEvent)=>{e.preventDefault();if(!projectId)return;try{const r=await updateProject(projectId,{name,description});setProject(r.data??r);setEditing(false);}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to update project");}};
  const remove=async()=>{if(!projectId||!window.confirm("Delete this project?"))return;try{await deleteProject(projectId);navigate("/projects");}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to delete project");}};
  if(!project)return <main className="page"><Link to="/projects">← Projects</Link>{error?<div className="error">{error}</div>:<p>Loading project...</p>}</main>;
  return <main className="page"><Link to="/projects">← Projects</Link>{error&&<div className="error">{error}</div>}
    <div className="page-header"><div><h1>{project.name}</h1><p>{project.description||"No description"}</p></div>{isAdmin&&!roleLoading&&<div><button onClick={()=>setEditing(v=>!v)}>Edit</button>{" "}<button className="danger-button" onClick={()=>void remove()}>Delete</button></div>}</div>
    {editing&&<form className="project-form" onSubmit={save}><input value={name} onChange={e=>setName(e.target.value)} required/><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}/><button>Save changes</button></form>}
    <div className="project-sections"><Link to={`/projects/${project._id}/tasks`}>Tasks</Link><Link to={`/projects/${project._id}/members`}>Members</Link><Link to={`/projects/${project._id}/notes`}>Notes</Link></div>
  </main>;
}
