import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { createProject, getProjects } from "../../api/project.api";
import type { Project } from "../../types/project";
import { useAuthContext } from "../../context/AuthContext";

export default function Projects() {
  const { user } = useAuthContext();
  const canCreate = user?.role === "admin";
  const [projects,setProjects]=useState<Project[]>([]); const [name,setName]=useState(""); const [description,setDescription]=useState("");
  const [loading,setLoading]=useState(true); const [creating,setCreating]=useState(false); const [error,setError]=useState("");
  const load=async()=>{try{const r=await getProjects();setProjects(r.data??r);}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to load projects");}finally{setLoading(false);}};
  useEffect(()=>{void load();},[]);
  const submit=async(e:FormEvent)=>{e.preventDefault();setCreating(true);setError("");try{await createProject({name,description:description||undefined});setName("");setDescription("");await load();}catch(err){setError((err as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to create project");}finally{setCreating(false);}};
  return <main className="page"><div className="page-header"><div><h1>Projects</h1><p>Projects you have access to.</p></div></div>{error&&<div className="error">{error}</div>}
    {canCreate&&<form className="project-form" onSubmit={submit}><h2>Create project</h2><input placeholder="Project name" value={name} onChange={e=>setName(e.target.value)} required/><textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} rows={3}/><button disabled={creating}>{creating?"Creating...":"Create project"}</button></form>}
    {loading?<p>Loading projects...</p>:projects.length===0?<p>No projects found.</p>:<div className="project-grid">{projects.map(p=><Link className="project-card" to={`/projects/${p._id}`} key={p._id}><h2>{p.name}</h2><p>{p.description||"No description"}</p></Link>)}</div>}
  </main>;
}
