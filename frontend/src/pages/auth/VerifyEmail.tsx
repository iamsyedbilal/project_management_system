import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/axios";
export default function VerifyEmail() {
  const { verificationToken } = useParams<{ verificationToken: string }>();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!verificationToken) return;
    api
      .get(`/auth/verify-email/${verificationToken}`)
      .then((r) =>
        setMessage(r.data?.message || "Email verified successfully."),
      )
      .catch((e) =>
        setError(e.response?.data?.message || "Verification failed."),
      );
  }, [verificationToken]);
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7fb] px-4">
      <div className="w-full max-w-md rounded-4xl bg-white p-8 text-center shadow-[0_25px_80px_rgba(76,29,149,.12)]">
        <div className="text-5xl">{error ? "⚠️" : "✨"}</div>
        <h1 className="mt-4 font-display text-3xl font-bold">
          Email verification
        </h1>
        <p className={`mt-3 ${error ? "text-red-600" : "text-slate-500"}`}>
          {error || message}
        </p>
        <Link
          className="mt-7 inline-block rounded-2xl bg-violet-100 px-5 py-3 font-bold text-violet-700"
          to="/login"
        >
          Go to sign in →
        </Link>
      </div>
    </main>
  );
}
