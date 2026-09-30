import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/axios";

export default function VerifyEmail() {
  const { verificationToken } = useParams<{ verificationToken: string }>();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!verificationToken) return;
    api.get(`/auth/verify-email/${verificationToken}`)
      .then((r) => setMessage(r.data?.message || "Email verified successfully."))
      .catch((e) => setError(e.response?.data?.message || "Verification failed."));
  }, [verificationToken]);

  return <main className="auth-page"><div className="auth-card">
    <h1>Email verification</h1>
    {error ? <div className="error">{error}</div> : <p>{message}</p>}
    <Link to="/login">Go to sign in</Link>
  </div></main>;
}
