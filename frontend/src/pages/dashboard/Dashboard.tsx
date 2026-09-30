import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate("/login", { replace: true }); };
  return <main className="page">
    <div className="page-header"><div><h1>Dashboard</h1><p>Welcome, {user?.fullName || user?.username}.</p></div><button onClick={() => void signOut()}>Logout</button></div>
    <p>Role: <strong>{user?.role}</strong></p>
    <div className="project-sections"><Link to="/projects">Projects</Link><Link to="/change-password">Change password</Link></div>
  </main>;
}
