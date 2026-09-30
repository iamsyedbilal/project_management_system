import { useEffect,useState } from "react";
import type { FormEvent } from "react";
import { Link,useNavigate,useParams } from "react-router-dom";
import { deleteNote,getNote,updateNote } from "../../api/note.api";
import { useAuthContext } from "../../context/AuthContext";

export default function NoteDetails(){
 const {projectId,noteId}=useParams<{projectId:string;noteId:string}>();const navigate=useNavigate();const {user}=useAuthContext();const canManage=user?.role==="admin";
 const [title,setTitle]=useState("");const [content,setContent]=useState("");const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{if(!projectId||!noteId)return;getNote(projectId,noteId).then(r=>{const n=r.data??r;setTitle(n.title||"");setContent(n.content||"");}).catch(e=>setError(e.response?.data?.message||"Unable to load note")).finally(()=>setLoading(false));},[projectId,noteId]);
 const save=async(e:FormEvent)=>{e.preventDefault();if(!projectId||!noteId)return;setSaving(true);try{await updateNote(projectId,noteId,{title,content});setError("");}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to update note");}finally{setSaving(false);}};
 const remove=async()=>{if(!projectId||!noteId||!window.confirm("Delete this note?"))return;try{await deleteNote(projectId,noteId);navigate(`/projects/${projectId}/notes`);}catch(e){setError((e as {response?:{data?:{message?:string}}}).response?.data?.message||"Unable to delete note");}};
 if(loading)return <main className="page"><p>Loading note...</p></main>;
 return <main className="page"><Link to={`/projects/${projectId}/notes`}>← Notes</Link><div className="page-header"><div><h1>{canManage?"Edit Note":"Note"}</h1></div>{canManage&&<button className="danger-button" onClick={()=>void remove()}>Delete note</button>}</div>{error&&<div className="error">{error}</div>}
 <form className="note-form" onSubmit={save}><label>Title<input value={title} onChange={e=>setTitle(e.target.value)} disabled={!canManage} required/></label><label>Content<textarea value={content} onChange={e=>setContent(e.target.value)} rows={12} disabled={!canManage} required/></label>{canManage&&<button disabled={saving}>{saving?"Saving...":"Save changes"}</button>}</form>
 </main>;
}
