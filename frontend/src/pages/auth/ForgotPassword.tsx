import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/auth.api";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await forgotPassword(email);
      setMessage(
        r.message || "If the account exists, a reset email has been sent.",
      );
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Unable to send reset email",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f7f7fb] px-4">
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-4xl bg-white p-8 shadow-[0_25px_80px_rgba(76,29,149,.15)]"
      >
        <span className="font-bold uppercase tracking-[.18em] text-violet-600">
          FlowBoard
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold">
          Reset your password<span className="text-fuchsia-500">.</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we’ll send instructions.
        </p>
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
        <input
          className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:ring-4 focus:ring-violet-100"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        <button
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-linear-to-r from-violet-600 to-fuchsia-500 py-3.5 font-bold text-white disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
        <Link
          className="mt-5 block text-center font-bold text-violet-600"
          to="/login"
        >
          ← Back to sign in
        </Link>
      </form>
    </main>
  );
}
