import { useEffect, useState } from "react";

function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch tasks"
          );
        }

        setTasks(data.tasks || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task status"
        );
      }

      // Update task locally
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? data.task
            : task
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Group tasks by status
  const todoTasks = tasks.filter(
    (task) => task.status === "To Do"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  // Task card
  const TaskCard = ({ task }) => (
    <div className="kanban-task-card">
      <div className="kanban-task-header">
        <h3>{task.title}</h3>

        <span
          className={`kanban-priority ${String(
            task.priority || "Medium"
          ).toLowerCase()}`}
        >
          {task.priority || "Medium"}
        </span>
      </div>

      <p>
        {task.description ||
          "No description provided."}
      </p>

      <div className="kanban-task-details">
        <span>
          {task.project?.name || "Project"}
        </span>

        <span>
          {task.deadline
            ? new Date(
                task.deadline
              ).toLocaleDateString()
            : "No deadline"}
        </span>
      </div>

      {/* Status */}
      <div className="kanban-status-control">
        <label htmlFor={`status-${task._id}`}>
          Status
        </label>

        <select
          id={`status-${task._id}`}
          value={task.status || "To Do"}
          disabled={updatingTaskId === task._id}
          onChange={(e) =>
            handleStatusChange(
              task._id,
              e.target.value
            )
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

        {updatingTaskId === task._id && (
          <span className="kanban-updating">
            Updating...
          </span>
        )}
      </div>
    </div>
  );

  // Kanban column
  const KanbanColumn = ({
    title,
    tasks: columnTasks,
  }) => (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h2>{title}</h2>

        <span className="kanban-count">
          {columnTasks.length}
        </span>
      </div>

      <div className="kanban-column-body">
        {columnTasks.length === 0 ? (
          <div className="kanban-empty">
            No tasks
          </div>
        ) : (
          columnTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );

  // Loading
  if (loading) {
    return (
      <div className="panel">
        <h2>Kanban</h2>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Kanban Board</h1>
          <p>
            Organize and track your tasks by status
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="project-error">
          {error}
        </div>
      )}

      {/* Board */}
      <div className="kanban-board">
        <KanbanColumn
          title="To Do"
          tasks={todoTasks}
        />

        <KanbanColumn
          title="In Progress"
          tasks={inProgressTasks}
        />

        <KanbanColumn
          title="Completed"
          tasks={completedTasks}
        />
      </div>
    </div>
  );
}

export default Kanban;