import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { loginUser } from "../../api/auth.api";
import { useAuthContext } from "../../context/AuthContext";
import type { User } from "../../types/auth";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await loginUser({ identifier, password });
      const user = (response.data?.user ?? response.user) as User;
      setUser(user);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(isAxiosError<{message?:string}>(err) ? err.response?.data?.message || "Login failed" : "Login failed");
    } finally { setLoading(false); }
  };
  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Sign in</h1><p>Project Management System</p>
    {error && <div className="error">{error}</div>}
    <label>Email or username<input type="text" value={identifier} onChange={e=>setIdentifier(e.target.value)} autoComplete="username" required /></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    <Link to="/forgot-password">Forgot password?</Link>
    <span>Don't have an account? <Link to="/register">Register</Link></span>
  </form></main>;
}
