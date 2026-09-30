import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/auth.api";
export default function ResetPassword() {
  const { resetToken } = useParams<{ resetToken: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!resetToken) throw new Error("Invalid reset token");
      await resetPassword(resetToken, password, confirmPassword);
      navigate("/login");
    } catch (e: unknown) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
          (e as Error).message ||
          "Password reset failed",
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
        <span className="font-bold uppercase tracking-[.18em] text-violet-600">
          FlowBoard
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold">
          Choose a new password<span className="text-fuchsia-500">.</span>
        </h1>
        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="mt-6 grid gap-4">
          <input
            className={field}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className={field}
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 py-3.5 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </div>
        <Link
          className="mt-5 block text-center font-bold text-violet-600"
          to="/login"
        >
          Back to sign in
        </Link>
      </form>
    </main>
  );
}
