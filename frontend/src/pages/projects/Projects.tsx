import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { createProject, getProjects } from "../../api/project.api";
import type { Project } from "../../types/project";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data ?? response);
    } catch (err: unknown) {
      const message = (err as ApiError).response?.data?.message;
      setError(message || "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let active = true;

    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        if (active) setProjects(response.data ?? response);
      } catch (err: unknown) {
        if (active) {
          const message = (err as ApiError).response?.data?.message;
          setError(message || "Unable to load projects");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchProjects();
    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setError("");
    try {
      await createProject({ name, description: description || undefined });
      setName("");
      setDescription("");
      await load();
    } catch (err: unknown) {
      const message = (err as ApiError).response?.data?.message;
      setError(message || "Unable to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Projects you have access to.</p>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="project-form" onSubmit={submit}>
        <h2>Create project</h2>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button disabled={creating}>
          {creating ? "Creating..." : "Create project"}
        </button>
      </form>
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <Link
              className="project-card"
              to={`/projects/${project._id}`}
              key={project._id}
            >
              <h2>{project.name}</h2>
              <p>{project.description || "No description"}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
