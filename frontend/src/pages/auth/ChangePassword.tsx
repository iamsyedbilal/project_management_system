import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { changePassword } from "../../api/auth.api";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword:"", newPassword:"", confirmPassword:"" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try { await changePassword(form); setMessage("Password changed successfully."); setForm({currentPassword:"",newPassword:"",confirmPassword:""}); }
    catch (e: unknown) { setError((e as {response?:{data?:{message?:string}}}).response?.data?.message || "Unable to change password"); }
    finally { setLoading(false); }
  };

  return <main className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Change password</h1>
    {message && <div className="success">{message}</div>}
    {error && <div className="error">{error}</div>}
    <label>Current password<input type="password" value={form.currentPassword} onChange={e=>setForm({...form,currentPassword:e.target.value})} required /></label>
    <label>New password<input type="password" value={form.newPassword} onChange={e=>setForm({...form,newPassword:e.target.value})} required /></label>
    <label>Confirm new password<input type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} required /></label>
    <button disabled={loading}>{loading ? "Saving..." : "Change password"}</button>
    <Link to="/dashboard">Back to dashboard</Link>
  </form></main>;
}
