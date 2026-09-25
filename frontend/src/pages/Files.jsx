import { useEffect, useState } from "react";

function Files() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch files"
        );
      }

      setFiles(data.files || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchProjects();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("projectId", projectId);

      const response = await fetch(
        "http://localhost:5000/api/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "File upload failed"
        );
      }

      setSuccess("File uploaded successfully.");

      setSelectedFile(null);
      setProjectId("");

      document.getElementById("file-input").value = "";

      await fetchFiles();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="panel">
        <h2>Files</h2>
        <p>Loading your files...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Files</h1>
          <p>Share and manage project files</p>
        </div>
      </div>

      {error && (
        <div className="project-error">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="form-card">
        <h2>Upload File</h2>

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="file-input">
              Select File
            </label>

            <input
              id="file-input"
              type="file"
              onChange={(event) =>
                setSelectedFile(event.target.files[0])
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-select">
              Project
            </label>

            <select
              id="project-select"
              value={projectId}
              onChange={(event) =>
                setProjectId(event.target.value)
              }
            >
              <option value="">
                Select a project
              </option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <h2>No files yet</h2>
          <p>
            Files shared with your projects will
            appear here.
          </p>
        </div>
      ) : (
        <div className="project-list">
          {files.map((file) => (
            <div
              className="project-card"
              key={file._id}
            >
              <div className="project-card-header">
                <h3>
                  {file.originalName ||
                    file.fileName ||
                    "Unnamed file"}
                </h3>
              </div>

              <div className="project-details">
                <div>
                  <span className="detail-label">
                    Project
                  </span>

                  <span>
                    {file.projectId?.name ||
                      "Unknown project"}
                  </span>
                </div>

                <div>
                  <span className="detail-label">
                    Uploaded By
                  </span>

                  <span>
                    {file.uploadedBy?.name ||
                      "Unknown"}
                  </span>
                </div>

                <div>
                  <span className="detail-label">
                    File Type
                  </span>

                  <span>
                    {file.fileType || "Unknown"}
                  </span>
                </div>

                <div>
                  <span className="detail-label">
                    Uploaded
                  </span>

                  <span>
                    {file.createdAt
                      ? new Date(
                          file.createdAt
                        ).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Files;