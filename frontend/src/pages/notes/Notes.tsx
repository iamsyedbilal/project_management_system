import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createNote,
  deleteNote,
  getNotes,
  type Note,
} from "../../api/note.api";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return fallback;
  }

  const response = error.response;
  if (typeof response !== "object" || response === null || !("data" in response)) {
    return fallback;
  }

  const data = response.data;
  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback;
};

export default function Notes() {
  const { projectId } = useParams<{ projectId: string }>();
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to load notes"));
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
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Unable to load notes"));
        }
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
    setError("");
    try {
      await createNote(projectId, { title, content });
      setTitle("");
      setContent("");
      await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to create note"));
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    if (!projectId || !window.confirm("Delete this note?")) return;
    try {
      await deleteNote(projectId, id);
      await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Unable to delete note"));
    }
  };
  return (
    <main className="page">
      <Link to={`/projects/${projectId}`}>← Project</Link>
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p>Project notes and shared information.</p>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="note-form" onSubmit={submit}>
        <h2>Create note</h2>
        <input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
        />
        <button disabled={saving}>
          {saving ? "Creating..." : "Create note"}
        </button>
      </form>
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <h2>No notes</h2>
          <p>No project notes have been created yet.</p>
        </div>
      ) : (
        <div className="note-grid">
          {notes.map((note) => (
            <article className="note-card" key={note._id}>
              <div>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </div>
              <div className="note-actions">
                <Link to={`/projects/${projectId}/notes/${note._id}`}>
                  Open
                </Link>
                <button
                  className="danger-button"
                  onClick={() => void remove(note._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
