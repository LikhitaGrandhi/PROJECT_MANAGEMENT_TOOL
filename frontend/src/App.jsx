import { useState, useEffect } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

import socket from "./socket";
import FileUpload from "./components/FileUpload";

const PROJECT_ID = "6ab57dfee5f99a08519996a9";

function App() {
  const [count, setCount] = useState(0);

  // Store tasks received through Socket.io
  const [tasks, setTasks] = useState([]);

  // Socket.io connection + real-time task events
  useEffect(() => {
    // User A/B joins the same project room
    const handleConnect = () => {
      console.log("Socket.io connected:", socket.id);

      socket.emit("join-project", PROJECT_ID);

      console.log("Joined project:", PROJECT_ID);
    };

    // Task created
    const handleTaskCreated = (task) => {
      console.log("Task created:", task);

      setTasks((currentTasks) => {
        // Prevent duplicate task
        const alreadyExists = currentTasks.some(
          (existingTask) => existingTask._id === task._id
        );

        if (alreadyExists) {
          return currentTasks;
        }

        return [...currentTasks, task];
      });
    };

    // Task updated
    const handleTaskUpdated = (updatedTask) => {
      console.log("Task updated:", updatedTask);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    };

    // Task deleted
    const handleTaskDeleted = ({ taskId }) => {
      console.log("Task deleted:", taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );
    };

    const handleConnectError = (error) => {
      console.error("Socket error:", error.message);
    };

    // Register Socket.io listeners
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    socket.on("task-created", handleTaskCreated);
    socket.on("task-updated", handleTaskUpdated);
    socket.on("task-deleted", handleTaskDeleted);

    // Connect
    socket.connect();

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);

      socket.off("task-created", handleTaskCreated);
      socket.off("task-updated", handleTaskUpdated);
      socket.off("task-deleted", handleTaskDeleted);

      socket.emit("leave-project", PROJECT_ID);
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt=""
          />

          <img
            src={reactLogo}
            className="framework"
            alt="React logo"
          />

          <img
            src={viteLogo}
            className="vite"
            alt="Vite logo"
          />
        </div>

        <div>
          <h1>Get started</h1>

          <p>
            Edit <code>src/App.jsx</code> and save to test{" "}
            <code>HMR</code>
          </p>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      {/* Real-time task updates */}
      <section
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h2>Real-Time Tasks</h2>

        <p>
          Project: <strong>{PROJECT_ID}</strong>
        </p>

        {tasks.length === 0 ? (
          <p>No real-time task events received yet.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} style={{ marginBottom: "15px" }}>
                <strong>{task.title}</strong>

                <br />

                Status: {task.status}

                <br />

                Priority: {task.priority}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>

          <h2>Documentation</h2>
          <p>Your questions, answered</p>

          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>

            <li>
              <a href="https://react.dev/" target="_blank">
                <img
                  className="button-icon"
                  src={reactLogo}
                  alt=""
                />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>

          <h2>Connect with us</h2>
          <p>Join the Vite community</p>

          <ul>
            <li>
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>

            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>

            <li>
              <a
                href="https://x.com/vite_js"
                target="_blank"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>

            <li>
              <a
                href="https://bsky.app/profile/vite.dev"
                target="_blank"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="spacer"></section>

      {/* File upload component */}
      <FileUpload />
    </>
  );
}

export default App;