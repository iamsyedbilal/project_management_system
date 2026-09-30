import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { changePassword } from "../../api/auth.api";
export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await changePassword(form);
      setMessage("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to change password",
      );
    } finally {
      setLoading(false);
    }
  };
  const field =
    "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100";
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7fb] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-4xl bg-white p-8 shadow-[0_25px_80px_rgba(76,29,149,.12)]"
      >
        <h1 className="font-display text-3xl font-bold">
          Change password<span className="text-fuchsia-500">.</span>
        </h1>
        {message && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="mt-6 grid gap-4">
          <input
            className={field}
            type="password"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
            required
          />
          <input
            className={field}
            type="password"
            placeholder="New password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
          <input
            className={field}
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
          <button
            disabled={loading}
            className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 py-3.5 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Change password"}
          </button>
        </div>
        <Link
          className="mt-5 block text-center font-bold text-violet-600"
          to="/dashboard"
        >
          ← Dashboard
        </Link>
      </form>
    </main>
  );
}
