import { useEffect, useState } from "react";

function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch user details"
          );
        }

        setUser(data.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <h2>Settings</h2>
        <p>Loading account information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your account information</p>
          </div>
        </div>

        <div className="project-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-profile">
          <div className="settings-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2>{user?.name || "User"}</h2>
            <p>{user?.role || "Team Member"}</p>
          </div>
        </div>

        <div className="settings-details">
          <div className="settings-detail">
            <span className="detail-label">
              Full Name
            </span>

            <strong>
              {user?.name || "Not available"}
            </strong>
          </div>

          <div className="settings-detail">
            <span className="detail-label">
              Email
            </span>

            <strong>
              {user?.email || "Not available"}
            </strong>
          </div>

          <div className="settings-detail">
            <span className="detail-label">
              Role
            </span>

            <strong>
              {user?.role || "Not available"}
            </strong>
          </div>

          <div className="settings-detail">
            <span className="detail-label">
              Account Created
            </span>

            <strong>
              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;