import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

function Dashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      // If token does not exist, go to login
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const [analyticsResponse, projectsResponse, tasksResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/analytics", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/projects", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch("http://localhost:5000/api/tasks", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const analyticsData = await analyticsResponse.json();
      const projectsData = await projectsResponse.json();
      const tasksData = await tasksResponse.json();

      // Check for invalid or expired token
      if (
        analyticsResponse.status === 401 ||
        projectsResponse.status === 401 ||
        tasksResponse.status === 401
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!analyticsResponse.ok) {
        throw new Error(
          analyticsData.message || "Failed to fetch analytics"
        );
      }

      if (!projectsResponse.ok) {
        throw new Error(
          projectsData.message || "Failed to fetch projects"
        );
      }

      if (!tasksResponse.ok) {
        throw new Error(
          tasksData.message || "Failed to fetch tasks"
        );
      }

      setAnalytics(analyticsData.analytics);
      setProjects(projectsData.projects || []);
      setTasks(tasksData.tasks || []);
    } catch (error) {
      console.error("Dashboard error:", error);

      // If the request itself fails because of authentication
      if (
        error.message?.toLowerCase().includes("unauthorized") ||
        error.message?.toLowerCase().includes("invalid token")
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Socket.io real-time task updates
  useEffect(() => {
    const handleTaskCreated = (task) => {
      setTasks((currentTasks) => {
        const alreadyExists = currentTasks.some(
          (existingTask) => existingTask._id === task._id
        );

        if (alreadyExists) {
          return currentTasks;
        }

        return [...currentTasks, task];
      });
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );
    };

    const handleConnectError = (error) => {
      console.error("Socket error:", error.message);

      // Handle socket authentication failure
      if (
        error.message?.toLowerCase().includes("unauthorized") ||
        error.message?.toLowerCase().includes("invalid token")
      ) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

    socket.on("task-created", handleTaskCreated);
    socket.on("task-updated", handleTaskUpdated);
    socket.on("task-deleted", handleTaskDeleted);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("task-created", handleTaskCreated);
      socket.off("task-updated", handleTaskUpdated);
      socket.off("task-deleted", handleTaskDeleted);
      socket.off("connect_error", handleConnectError);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="panel">
        <h2>Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel">
        <h2>Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  const totalProjects = analytics?.totalProjects || 0;
  const totalTasks = analytics?.totalTasks || 0;

  const completedTasks =
    analytics?.taskStats?.completedTasks || 0;

  const inProgressTasks =
    analytics?.taskStats?.inProgressTasks || 0;

  const recentProjects = projects.slice(0, 3);

  const getProjectProgress = (projectId) => {
    const project = analytics?.projectProgress?.find(
      (item) =>
        item.projectId?.toString() === projectId?.toString()
    );

    return project?.progress || 0;
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="welcome-text">Welcome back 👋</p>
          <h1>Dashboard</h1>
        </div>

        <div className="topbar-actions">
          <button className="icon-button">⌕</button>
          <button className="icon-button">🔔</button>

          <div className="profile">
            <div className="avatar">D</div>
            <span>Deepika</span>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">▣</div>

          <div>
            <span>Total Projects</span>
            <strong>{totalProjects}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">✓</div>

          <div>
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">↗</div>

          <div>
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">◷</div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>
        </div>
      </section>

      {/* Projects and Activity */}
      <section className="dashboard-grid">
        <div className="panel projects-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Projects</h2>
              <p>Keep track of your active projects</p>
            </div>
          </div>

          <div className="project-list">
            {recentProjects.length === 0 ? (
              <p>No projects available.</p>
            ) : (
              recentProjects.map((project) => {
                const progress = getProjectProgress(
                  project._id
                );

                return (
                  <div
                    className="project-row"
                    key={project._id}
                  >
                    <div className="project-color purple-bg">
                      {project.name
                        ?.charAt(0)
                        .toUpperCase() || "P"}
                    </div>

                    <div className="project-info">
                      <strong>{project.name}</strong>

                      <span>
                        {project.status || "No status"} ·{" "}
                        {progress}% complete
                      </span>
                    </div>

                    <div className="progress-wrapper">
                      <div className="progress-label">
                        <span>{progress}%</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          style={{
                            width: `${progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest task updates</p>
            </div>
          </div>

          <div className="activity-list">
            {tasks.length === 0 ? (
              <p>No recent tasks.</p>
            ) : (
              tasks
                .slice(-3)
                .reverse()
                .map((task) => (
                  <div
                    className="activity-item"
                    key={task._id}
                  >
                    <div className="activity-avatar">
                      T
                    </div>

                    <div>
                      <strong>{task.title}</strong>

                      <span>
                        {task.status || "To Do"} ·{" "}
                        {task.priority || "Medium"}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </section>

      {/* Real-time Tasks */}
      {tasks.length > 0 && (
        <section
          className="panel"
          style={{ marginTop: "22px" }}
        >
          <div className="panel-header">
            <div>
              <h2>Current Tasks</h2>
              <p>Tasks from your project management system</p>
            </div>
          </div>

          {tasks.slice(0, 5).map((task) => (
            <div
              className="activity-item"
              key={task._id}
            >
              <div className="activity-avatar">T</div>

              <div>
                <strong>{task.title}</strong>

                <span>
                  Status: {task.status || "To Do"} · Priority:{" "}
                  {task.priority || "Medium"}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export default Dashboard;