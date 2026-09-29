import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../../api/project.api";
import type { Project } from "../../types/project";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!projectId) return;
    getProject(projectId)
      .then((r) => setProject(r.data ?? r))
      .catch((err: unknown) => {
        const response =
          typeof err === "object" && err !== null && "response" in err
            ? err.response
            : undefined;
        const message =
          typeof response === "object" && response !== null && "data" in response
            ? response.data
            : undefined;
        const errorMessage =
          typeof message === "object" && message !== null && "message" in message
            ? message.message
            : undefined;
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : "Unable to load project",
        );
      });
  }, [projectId]);
  if (error)
    return (
      <main className="page">
        <div className="error">{error}</div>
        <Link to="/projects">Back to projects</Link>
      </main>
    );
  if (!project)
    return (
      <main className="page">
        <p>Loading project...</p>
      </main>
    );
  return (
    <main className="page">
      <Link to="/projects">← Projects</Link>
      <h1>{project.name}</h1>
      <p>{project.description || "No description"}</p>
      <div className="project-sections">
        <Link to={`/projects/${project._id}/tasks`}>Tasks</Link>
        <Link to={`/projects/${project._id}/members`}>Members</Link>
        <Link to={`/projects/${project._id}/notes`}>Notes</Link>
      </div>
    </main>
  );
}
