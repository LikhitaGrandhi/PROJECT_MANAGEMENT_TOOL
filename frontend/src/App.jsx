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
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks.jsx";
import Kanban from "./pages/Kanban.jsx";
import Files from "./pages/Files.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

import "./App.css";


// ===============================
// Protected Route
// ===============================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// ===============================
// Main App
// ===============================
function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // ===============================
  // Logout
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };


  // ===============================
  // Authentication Pages
  // No Sidebar
  // ===============================
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    );
  }


  // ===============================
  // Main Application
  // ===============================
  return (
    <div className="app-shell">

      {/* =================================
          Sidebar
      ================================= */}
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <h1>ProjectFlow</h1>
          <p>Project Management</p>
        </div>


        {/* Navigation */}
        <nav className="sidebar-nav">

          {/* Dashboard */}
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


          {/* Projects */}
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


          {/* Tasks */}
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


          {/* Kanban */}
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


          {/* Files */}
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


          {/* Reports */}
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


        {/* =================================
            Sidebar Bottom
        ================================= */}
        <div className="sidebar-bottom">

          {/* Settings */}
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


          {/* User */}
          <div className="sidebar-user">

            <div className="user-avatar">
              D
            </div>

            <div>
              <strong>Deepika</strong>
              <span>Team Member</span>
            </div>

          </div>


          {/* Logout */}
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* =================================
          Main Content
      ================================= */}
      <main className="main-content">

        <Routes>

          {/* =================================
              Root Route
          ================================= */}
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


          {/* =================================
              Login
          ================================= */}
          <Route
            path="/login"
            element={<Login />}
          />


          {/* =================================
              Register
          ================================= */}
          <Route
            path="/register"
            element={<Register />}
          />


          {/* =================================
              Dashboard
          ================================= */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Projects
          ================================= */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Tasks
          ================================= */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Kanban
          ================================= */}
          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Files
          ================================= */}
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <Files />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Reports
          ================================= */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Settings
          ================================= */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />


          {/* =================================
              Unknown Route
          ================================= */}
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