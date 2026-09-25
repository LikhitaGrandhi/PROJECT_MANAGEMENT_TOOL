import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch projects"
          );
        }

        setProjects(data.projects || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Create project
  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: projectName.trim(),
            description: projectDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create project"
        );
      }

      setProjects((currentProjects) => [
        data.project,
        ...currentProjects,
      ]);

      setProjectName("");
      setProjectDescription("");
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  // Start editing a project
  const handleEditProject = (project) => {
    setError("");

    setEditingProjectId(project._id);
    setProjectName(project.name || "");
    setProjectDescription(project.description || "");

    setShowForm(true);
  };

  // Update project
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/projects/${editingProjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: projectName.trim(),
            description: projectDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update project"
        );
      }

      // Update the project in the UI
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project._id === editingProjectId
            ? data.project
            : project
        )
      );

      // Reset form
      setProjectName("");
      setProjectDescription("");
      setEditingProjectId(null);
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project._id !== projectId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Cancel create/edit
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProjectId(null);
    setProjectName("");
    setProjectDescription("");
    setError("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="panel">
        <h2>Projects</h2>
        <p>Loading your projects...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage and track your projects</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setError("");
            setEditingProjectId(null);
            setProjectName("");
            setProjectDescription("");
            setShowForm(true);
          }}
        >
          + Create Project
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="project-error">
          {error}
        </div>
      )}

      {/* Create / Edit Project Form */}
      {showForm && (
        <form
          className="project-form-card"
          onSubmit={
            editingProjectId
              ? handleUpdateProject
              : handleCreateProject
          }
        >
          <h2>
            {editingProjectId
              ? "Edit Project"
              : "Create New Project"}
          </h2>

          <div className="form-group">
            <label htmlFor="project-name">
              Project Name
            </label>

            <input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              placeholder="Enter project description"
              rows="4"
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(e.target.value)
              }
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleCancelForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={creating || updating}
            >
              {editingProjectId
                ? updating
                  ? "Updating..."
                  : "Update Project"
                : creating
                  ? "Creating..."
                  : "Create Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects yet</h2>

          <p>
            Create your first project to start managing
            your work.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setError("");
              setEditingProjectId(null);
              setProjectName("");
              setProjectDescription("");
              setShowForm(true);
            }}
          >
            + Create Project
          </button>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div
              className="project-card"
              key={project._id}
            >
              {/* Project Header */}
              <div className="project-card-header">
                <h3>{project.name}</h3>

                <span className="project-status">
                  {project.status || "Planning"}
                </span>
              </div>

              {/* Description */}
              <p>
                {project.description ||
                  "No description provided."}
              </p>

              {/* Project Details */}
              <div className="project-details">
                <div>
                  <span className="detail-label">
                    Start Date
                  </span>

                  <span>
                    {project.startDate
                      ? new Date(
                          project.startDate
                        ).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>

                <div>
                  <span className="detail-label">
                    Deadline
                  </span>

                  <span>
                    {project.deadline
                      ? new Date(
                          project.deadline
                        ).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </div>

              {/* Project Actions */}
              <div className="project-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleEditProject(project)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDeleteProject(project._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;