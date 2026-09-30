import { useEffect,useState } from "react";
import type { FormEvent } from "react";
import { Link,useParams } from "react-router-dom";
import { createNote,deleteNote,getNotes,type Note } from "../../api/note.api";
import { useAuthContext } from "../../context/AuthContext";

export default function Notes(){
 const {projectId}=useParams<{projectId:string}>();const {user}=useAuthContext();const canManage=user?.role==="admin";
 const [notes,setNotes]=useState<Note[]>([]);const [title,setTitle]=useState("");const [content,setContent]=useState("");const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState("");
 const load=async()=>{if(!projectId)return;try{const r=await getNotes(projectId);setNotes(r.data??r);}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to load notes");}finally{setLoading(false);}};
 useEffect(()=>{void load();},[projectId]);
 const submit=async(e:FormEvent)=>{e.preventDefault();if(!projectId)return;setSaving(true);try{await createNote(projectId,{title,content});setTitle("");setContent("");await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to create note");}finally{setSaving(false);}};
 const remove=async(id:string)=>{if(!projectId||!window.confirm("Delete this note?"))return;try{await deleteNote(projectId,id);await load();}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to delete note");}};
 return <main className="page"><Link to={`/projects/${projectId}`}>← Project</Link><div className="page-header"><div><h1>Notes</h1><p>Project notes and shared information.</p></div></div>{error&&<div className="error">{error}</div>}
 {canManage&&<form className="note-form" onSubmit={submit}><h2>Create note</h2><input placeholder="Note title" value={title} onChange={e=>setTitle(e.target.value)} required/><textarea placeholder="Write your note..." value={content} onChange={e=>setContent(e.target.value)} rows={6} required/><button disabled={saving}>{saving?"Creating...":"Create note"}</button></form>}
 {loading?<p>Loading notes...</p>:notes.length===0?<div className="empty-state"><h2>No notes</h2></div>:<div className="note-grid">{notes.map(n=><article className="note-card" key={n._id}><div><h2>{n.title}</h2><p>{n.content}</p></div><div className="note-actions"><Link to={`/projects/${projectId}/notes/${n._id}`}>Open</Link>{canManage&&<button className="danger-button" onClick={()=>void remove(n._id)}>Delete</button>}</div></article>)}</div>}
 </main>;
}
