import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <main className="page">
      <h1>Dashboard</h1>
      <p>Manage your projects, tasks, members and notes.</p>
      <Link to="/projects">Projects</Link>
    </main>
  );
}
