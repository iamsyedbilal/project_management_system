import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  updateMemberRole,
  type MemberRole,
  type ProjectMember,
} from "../../api/member.api";
import { useProjectRole } from "../../hooks/useProjectRole";
const roles: MemberRole[] = ["project_admin", "member"];
export default function ProjectMembers() {
  const { projectId } = useParams<{ projectId: string }>();
  const { isAdmin } = useProjectRole(projectId);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    if (!projectId) return;
    try {
      const r = await getProjectMembers(projectId);
      setMembers(r.data ?? r);
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to load members",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!projectId) return;
    let active = true;
    const fetchMembers = async () => {
      try {
        const r = await getProjectMembers(projectId);
        if (active) setMembers(r.data ?? r);
      } catch (e) {
        if (active) {
          setError(
            (e as { response?: { data?: { message?: string } } }).response?.data
              ?.message || "Unable to load members",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchMembers();
    return () => {
      active = false;
    };
  }, [projectId]);
  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setSaving(true);
    try {
      await addProjectMember(projectId, { email, role });
      setEmail("");
      await load();
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to add member",
      );
    } finally {
      setSaving(false);
    }
  };
  const change = async (id: string, r: MemberRole) => {
    try {
      await updateMemberRole(projectId!, id, r);
      await load();
    } catch  {
      setError("Unable to update member role");
    }
  };
  const remove = async (id: string) => {
    if (!projectId || !window.confirm("Remove this member?")) return;
    try {
      await removeProjectMember(projectId, id);
      await load();
    } catch  {
      setError("Unable to remove member");
    }
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
          People<span className="text-fuchsia-500">.</span>
        </h1>
        <p className="mt-2 text-slate-500">Project members and their roles.</p>
        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {isAdmin && (
          <form
            onSubmit={add}
            className="mt-7 rounded-3xl bg-white p-6 shadow-lg"
          >
            <h2 className="font-display text-xl font-bold">Add member ✨</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                type="email"
                placeholder="User email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r === "project_admin" ? "Project Admin" : "Member"}
                  </option>
                ))}
              </select>
              <button
                disabled={saving}
                className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                {saving ? "Adding..." : "Add member"}
              </button>
            </div>
          </form>
        )}
        {loading ? (
          <p className="mt-6 text-slate-500">Loading members...</p>
        ) : (
          <div className="mt-6 grid gap-3">
            {members.map((m, i) => {
              const u = m.user;
              const id = u?._id;
              return (
                <div
                  key={id || m._id || i}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 font-display text-lg font-bold text-white">
                    {(u?.fullName || u?.username || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block font-bold">
                      {u?.fullName || u?.username || "Unnamed user"}
                    </strong>
                    <span className="text-sm text-slate-500">
                      {u?.email || u?.username || "No email"}
                    </span>
                  </div>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                    {m.role.replace("_", " ")}
                  </span>
                  {isAdmin && id && m.role !== "admin" && (
                    <div className="flex gap-2">
                      <select
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        value={m.role}
                        onChange={(e) =>
                          void change(id, e.target.value as MemberRole)
                        }
                      >
                        <option value="project_admin">Project Admin</option>
                        <option value="member">Member</option>
                      </select>
                      <button
                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-600"
                        onClick={() => void remove(id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
