import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [taskDeadline, setTaskDeadline] = useState("");

  const [saving, setSaving] = useState(false);

  // Fetch tasks and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [tasksResponse, projectsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/tasks", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch("http://localhost:5000/api/projects", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const tasksData = await tasksResponse.json();
        const projectsData = await projectsResponse.json();

        if (!tasksResponse.ok) {
          throw new Error(
            tasksData.message || "Failed to fetch tasks"
          );
        }

        if (!projectsResponse.ok) {
          throw new Error(
            projectsData.message || "Failed to fetch projects"
          );
        }

        setTasks(tasksData.tasks || []);
        setProjects(projectsData.projects || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset form
  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskProject("");
    setTaskPriority("Medium");
    setTaskStatus("To Do");
    setTaskDeadline("");
    setEditingTaskId(null);
    setShowForm(false);
  };

  // Open create form
  const handleOpenCreateForm = () => {
    setError("");
    resetForm();
    setShowForm(true);
  };

  // Open edit form
  const handleEditTask = (task) => {
    setError("");

    setEditingTaskId(task._id);
    setTaskTitle(task.title || "");
    setTaskDescription(task.description || "");

    setTaskProject(
      task.project?._id ||
      task.project ||
      ""
    );

    setTaskPriority(task.priority || "Medium");
    setTaskStatus(task.status || "To Do");

    if (task.deadline) {
      setTaskDeadline(
        new Date(task.deadline)
          .toISOString()
          .split("T")[0]
      );
    } else {
      setTaskDeadline("");
    }

    setShowForm(true);
  };

  // Create or update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      setError("Task title is required");
      return;
    }

    if (!taskProject) {
      setError("Please select a project");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const taskData = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        project: taskProject,
        priority: taskPriority,
        status: taskStatus,
        deadline: taskDeadline || null,
      };

      const url = editingTaskId
        ? `http://localhost:5000/api/tasks/${editingTaskId}`
        : "http://localhost:5000/api/tasks";

      const method = editingTaskId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          (editingTaskId
            ? "Failed to update task"
            : "Failed to create task")
        );
      }

      if (editingTaskId) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === editingTaskId
              ? data.task
              : task
          )
        );
      } else {
        setTasks((currentTasks) => [
          data.task,
          ...currentTasks,
        ]);
      }

      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
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
          data.message || "Failed to delete task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="panel">
        <h2>Tasks</h2>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="projects-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage and track your project tasks</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleOpenCreateForm}
        >
          + Create Task
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="project-error">
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <form
          className="project-form-card"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingTaskId
              ? "Edit Task"
              : "Create New Task"}
          </h2>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title">
              Task Title
            </label>

            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) =>
                setTaskTitle(e.target.value)
              }
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              placeholder="Enter task description"
              rows="4"
              value={taskDescription}
              onChange={(e) =>
                setTaskDescription(e.target.value)
              }
            />
          </div>

          {/* Project */}
          <div className="form-group">
            <label htmlFor="task-project">
              Project
            </label>

            <select
              id="task-project"
              value={taskProject}
              onChange={(e) =>
                setTaskProject(e.target.value)
              }
              required
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

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="task-priority">
              Priority
            </label>

            <select
              id="task-priority"
              value={taskPriority}
              onChange={(e) =>
                setTaskPriority(e.target.value)
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="task-status">
              Status
            </label>

            <select
              id="task-status"
              value={taskStatus}
              onChange={(e) =>
                setTaskStatus(e.target.value)
              }
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* Deadline */}
          <div className="form-group">
            <label htmlFor="task-deadline">
              Deadline
            </label>

            <input
              id="task-deadline"
              type="date"
              value={taskDeadline}
              onChange={(e) =>
                setTaskDeadline(e.target.value)
              }
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? editingTaskId
                  ? "Updating..."
                  : "Creating..."
                : editingTaskId
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      )}

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks yet</h2>

          <p>
            Create a task to start managing your
            project work.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={handleOpenCreateForm}
          >
            + Create Task
          </button>
        </div>
      ) : (
        <div className="project-list">
          {tasks.map((task) => (
            <div
              className="project-card"
              key={task._id}
            >
              {/* Task Header */}
              <div className="project-card-header">
                <h3>{task.title}</h3>

                <span className="project-status">
                  {task.status || "To Do"}
                </span>
              </div>

              {/* Description */}
              <p>
                {task.description ||
                  "No description provided."}
              </p>

              {/* Task Details */}
              <div className="project-details">
                <div>
                  <span className="detail-label">
                    Project
                  </span>

                  <span>
                    {task.project?.name ||
                      projects.find(
                        (project) =>
                          project._id ===
                          (task.project?._id || task.project)
                      )?.name ||
                      "Not assigned"}
                  </span>
                </div>

                <div>
                  <span className="detail-label">
                    Priority
                  </span>

                  <span>
                    {task.priority || "Not set"}
                  </span>
                </div>

                <div>
                  <span className="detail-label">
                    Deadline
                  </span>

                  <span>
                    {task.deadline
                      ? new Date(
                        task.deadline
                      ).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </div>

              {/* Task Actions */}
              <div className="project-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleEditTask(task)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDeleteTask(task._id)
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

export default Tasks;