import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteProject,
  getProject,
  updateProject,
} from "../../api/project.api";
import type { Project } from "../../types/project";
import { useProjectRole } from "../../hooks/useProjectRole";
export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useProjectRole(projectId);
  const [project, setProject] = useState<Project | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!projectId) return;
    getProject(projectId)
      .then((r) => {
        const p = r.data ?? r;
        setProject(p);
        setName(p.name || "");
        setDescription(p.description || "");
      })
      .catch((e) =>
        setError(e.response?.data?.message || "Unable to load project"),
      );
  }, [projectId]);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    try {
      const r = await updateProject(projectId, { name, description });
      setProject(r.data ?? r);
      setEditing(false);
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to update project",
      );
    }
  };
  const remove = async () => {
    if (!projectId || !window.confirm("Delete this project?")) return;
    try {
      await deleteProject(projectId);
      navigate("/projects");
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to delete project",
      );
    }
  };
  if (!project)
    return (
      <main className="min-h-screen bg-[#f7f7fb] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Link className="font-bold text-violet-600" to="/projects">
            ← Projects
          </Link>
          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : (
            <p className="mt-5 text-slate-500">Loading project...</p>
          )}
        </div>
      </main>
    );
  const card =
    "rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg";
  return (
    <main className="min-h-screen bg-[#f7f7fb] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link className="font-bold text-violet-600" to="/projects">
          ← Projects
        </Link>
        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}
        <header className="mb-8 mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-bold uppercase tracking-[.18em] text-violet-600">
              Project
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold">
              {project.name}
              <span className="text-fuchsia-500">.</span>
            </h1>
            <p className="mt-2 text-slate-500">
              {project.description || "No description"}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing((v) => !v)}
                className="rounded-xl bg-violet-100 px-4 py-2.5 font-bold text-violet-700"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={() => void remove()}
                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 font-bold text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </header>
        {editing && (
          <form
            onSubmit={save}
            className="mb-7 max-w-2xl rounded-3xl bg-white p-6 shadow-lg"
          >
            <div className="grid gap-3">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <textarea
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <button className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-bold text-white">
                Save changes
              </button>
            </div>
          </form>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link className={card} to={`/projects/${project._id}/tasks`}>
            <span className="text-3xl">📋</span>
            <h2 className="mt-4 font-display text-xl font-bold">Tasks</h2>
            <p className="text-sm text-slate-500">Plan and track work.</p>
          </Link>
          <Link className={card} to={`/projects/${project._id}/members`}>
            <span className="text-3xl">👥</span>
            <h2 className="mt-4 font-display text-xl font-bold">Members</h2>
            <p className="text-sm text-slate-500">Manage project access.</p>
          </Link>
          <Link className={card} to={`/projects/${project._id}/notes`}>
            <span className="text-3xl">📝</span>
            <h2 className="mt-4 font-display text-xl font-bold">Notes</h2>
            <p className="text-sm text-slate-500">Keep shared information.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
