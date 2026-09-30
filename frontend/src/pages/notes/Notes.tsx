import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createNote,
  deleteNote,
  getNotes,
  type Note,
} from "../../api/note.api";
import { useAuthContext } from "../../context/AuthContext";
export default function Notes() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuthContext();
  const canManage = user?.role === "admin";
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    if (!projectId) return;
    try {
      const r = await getNotes(projectId);
      setNotes(r.data ?? r);
    } catch  {
      setError("Unable to load notes");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;
    const fetchNotes = async () => {
      try {
        const r = await getNotes(projectId);
        if (!cancelled) setNotes(r.data ?? r);
      } catch {
        if (!cancelled) setError("Unable to load notes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchNotes();
    return () => {
      cancelled = true;
    };
  }, [projectId]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setSaving(true);
    try {
      await createNote(projectId, { title, content });
      setTitle("");
      setContent("");
      await load();
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to create note",
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    if (!projectId || !window.confirm("Delete this note?")) return;
    await deleteNote(projectId, id);
    await load();
  };
  return (
    <main className="min-h-screen bg-[#f7f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          className="font-bold text-violet-600"
          to={`/projects/${projectId}`}
        >
          ← Project
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold">
          Notes<span className="text-fuchsia-500">.</span>
        </h1>
        <p className="mt-2 text-slate-500">
          A shared space for important context.
        </p>
        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
        {canManage && (
          <form
            onSubmit={submit}
            className="mt-7 max-w-3xl rounded-[1.75rem] bg-white p-6 shadow-lg"
          >
            <h2 className="font-display text-xl font-bold">Create note 📝</h2>
            <div className="mt-4 grid gap-3">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                required
              />
              <button
                disabled={saving}
                className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create note +"}
              </button>
            </div>
          </form>
        )}
        {loading ? (
          <p className="mt-7 text-slate-500">Loading notes...</p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n) => (
              <article
                key={n._id}
                className="flex min-h-52 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-fuchsia-500">
                    Note
                  </span>
                  <h2 className="mt-3 font-display text-xl font-bold">
                    {n.title}
                  </h2>
                  <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                    {n.content}
                  </p>
                </div>
                <div className="mt-5 flex gap-2">
                  <Link
                    className="rounded-xl bg-violet-100 px-4 py-2.5 font-bold text-violet-700"
                    to={`/projects/${projectId}/notes/${n._id}`}
                  >
                    Open
                  </Link>
                  {canManage && (
                    <button
                      className="rounded-xl border border-red-200 px-4 py-2.5 font-bold text-red-600"
                      onClick={() => void remove(n._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
