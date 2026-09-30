import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteNote, getNote, updateNote } from "../../api/note.api";

type ApiError = {
  response?: { data?: { message?: string } };
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || fallback;
  }
  return fallback;
};

export default function NoteDetails() {
  const { projectId, noteId } = useParams<{
    projectId: string;
    noteId: string;
  }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!projectId || !noteId) return;
    getNote(projectId, noteId)
      .then((r) => {
        const n = r.data ?? r;
        setTitle(n.title || "");
        setContent(n.content || "");
      })
      .catch((err: unknown) =>
        setError(getErrorMessage(err, "Unable to load note")),
      )
      .finally(() => setLoading(false));
  }, [projectId, noteId]);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId || !noteId) return;
    setSaving(true);
    try {
      await updateNote(projectId, noteId, { title, content });
      setError("");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to update note"));
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!projectId || !noteId || !window.confirm("Delete this note?")) return;
    try {
      await deleteNote(projectId, noteId);
      navigate(`/projects/${projectId}/notes`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to delete note"));
    }
  };
  if (loading)
    return (
      <main className="page">
        <p>Loading note...</p>
      </main>
    );
  return (
    <main className="page">
      <Link to={`/projects/${projectId}/notes`}>← Notes</Link>
      <div className="page-header">
        <div>
          <h1>Edit Note</h1>
          <p>Update the project note.</p>
        </div>
        <button className="danger-button" onClick={() => void remove()}>
          Delete note
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="note-form" onSubmit={save}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
        </label>
        <button disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}
