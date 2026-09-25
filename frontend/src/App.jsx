import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks.jsx";
import Kanban from "./pages/Kanban.jsx";
import Files from "./pages/Files.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // Login page has no sidebar
  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
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

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          {/* Root */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem("token")
                    ? "/dashboard"
                    : "/login"
                }
                replace
              />
            }
          />

          {/* Protected pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />

          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <Files />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;