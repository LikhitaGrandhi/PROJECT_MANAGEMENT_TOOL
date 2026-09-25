import { useEffect, useState } from "react";

function Reports() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch analytics"
          );
        }

        setAnalytics(data.analytics);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <h2>Reports</h2>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="page-header">
          <div>
            <h1>Reports</h1>
            <p>Project and task analytics</p>
          </div>
        </div>

        <div className="project-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Project and task analytics</p>
        </div>
      </div>

      {/* Overview */}
      <div className="reports-grid">
        <div className="report-card">
          <span className="report-label">
            Total Projects
          </span>

          <strong className="report-number">
            {analytics.totalProjects}
          </strong>
        </div>

        <div className="report-card">
          <span className="report-label">
            Total Tasks
          </span>

          <strong className="report-number">
            {analytics.totalTasks}
          </strong>
        </div>

        <div className="report-card">
          <span className="report-label">
            Completion
          </span>

          <strong className="report-number">
            {analytics.completionPercentage}%
          </strong>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="report-section">
        <h2>Project Statistics</h2>

        <div className="reports-grid">
          <div className="report-card">
            <span className="report-label">
              Planning
            </span>

            <strong className="report-number">
              {analytics.projectStats.planningProjects}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              In Progress
            </span>

            <strong className="report-number">
              {analytics.projectStats.inProgressProjects}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              Completed
            </span>

            <strong className="report-number">
              {analytics.projectStats.completedProjects}
            </strong>
          </div>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="report-section">
        <h2>Task Statistics</h2>

        <div className="reports-grid">
          <div className="report-card">
            <span className="report-label">
              To Do
            </span>

            <strong className="report-number">
              {analytics.taskStats.todoTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              In Progress
            </span>

            <strong className="report-number">
              {analytics.taskStats.inProgressTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              Completed
            </span>

            <strong className="report-number">
              {analytics.taskStats.completedTasks}
            </strong>
          </div>
        </div>
      </div>

      {/* Priority Statistics */}
      <div className="report-section">
        <h2>Task Priority</h2>

        <div className="reports-grid">
          <div className="report-card">
            <span className="report-label">
              Low Priority
            </span>

            <strong className="report-number">
              {analytics.priorityStats.lowPriorityTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              Medium Priority
            </span>

            <strong className="report-number">
              {analytics.priorityStats.mediumPriorityTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              High Priority
            </span>

            <strong className="report-number">
              {analytics.priorityStats.highPriorityTasks}
            </strong>
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="report-section">
        <h2>Project Progress</h2>

        {analytics.projectProgress.length === 0 ? (
          <div className="empty-state">
            <h3>No project progress available</h3>
            <p>
              Create projects and tasks to see progress
              here.
            </p>
          </div>
        ) : (
          <div className="project-progress-list">
            {analytics.projectProgress.map((project) => (
              <div
                className="progress-card"
                key={project.projectId}
              >
                <div className="progress-header">
                  <div>
                    <h3>{project.projectName}</h3>

                    <p>
                      {project.completedTasks} of{" "}
                      {project.totalTasks} tasks completed
                    </p>
                  </div>

                  <strong>
                    {project.progress}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deadline Statistics */}
      <div className="report-section">
        <h2>Deadline Statistics</h2>

        <div className="reports-grid">
          <div className="report-card">
            <span className="report-label">
              Overdue Tasks
            </span>

            <strong className="report-number">
              {analytics.deadlineStats.overdueTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              Upcoming Tasks
            </span>

            <strong className="report-number">
              {analytics.deadlineStats.upcomingTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              No Deadline Tasks
            </span>

            <strong className="report-number">
              {analytics.deadlineStats.noDeadlineTasks}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              Overdue Projects
            </span>

            <strong className="report-number">
              {analytics.deadlineStats.overdueProjects}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              Upcoming Projects
            </span>

            <strong className="report-number">
              {analytics.deadlineStats.upcomingProjects}
            </strong>
          </div>

          <div className="report-card">
            <span className="report-label">
              No Deadline Projects
            </span>

            <strong className="report-number">
              {analytics.deadlineStats.noDeadlineProjects}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;