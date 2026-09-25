import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks.jsx";
import "./App.css";
import Kanban from "./pages/Kanban.jsx";
import Files from "./pages/Files.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

function PlaceholderPage({ title }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <p>This section is coming soon.</p>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Hide sidebar on login page
  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>ProjectFlow</h1>
          <p>Project Management</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Dashboard
          </Link>

          <Link
            to="/projects"
            className={
              location.pathname === "/projects"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Projects
          </Link>

          <Link
            to="/tasks"
            className={
              location.pathname === "/tasks"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Tasks
          </Link>

          <Link
            to="/kanban"
            className={
              location.pathname === "/kanban"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Kanban
          </Link>

          <Link
            to="/files"
            className={
              location.pathname === "/files"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Files
          </Link>

          <Link
            to="/reports"
            className={
              location.pathname === "/reports"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Reports
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link
            to="/settings"
            className={
              location.pathname === "/settings"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Settings
          </Link>

          <div className="sidebar-user">
            <div className="user-avatar">D</div>

            <div>
              <strong>Deepika</strong>
              <span>Team Member</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          {/* Dashboard */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* Tasks */}
          <Route
            path="/tasks"
            element={<Tasks />}
          />

          {/* Other pages */}
          <Route
            path="/kanban"
            element={<Kanban />}
          />

          <Route
            path="/files"
            element={<Files />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;