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

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); setLoading(true);
    try {
      if (!resetToken) throw new Error("Invalid reset token");
      await resetPassword(resetToken, password, confirmPassword);
      navigate("/login");
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string }}}).response?.data?.message || (e as Error).message || "Password reset failed");
    } finally { setLoading(false); }
  };

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Reset password</h1>
    {error && <div className="error">{error}</div>}
    <label>New password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    <label>Confirm password<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required /></label>
    <button disabled={loading}>{loading ? "Resetting..." : "Reset password"}</button>
    <Link to="/login">Back to sign in</Link>
  </form></main>;
}
