# Project Management Tool

A full-stack MERN-based Project Management Tool designed to help teams plan projects, manage tasks, track progress, collaborate in real time, share files, and view project analytics from a centralized dashboard.

---

## 📌 Project Overview

The Project Management Tool provides a centralized workspace for managing projects and team activities.

The system combines project management, task tracking, Kanban workflow management, file sharing, real-time collaboration, analytics, and user management in one application.

The application includes:

- User authentication and role management
- Project creation and management
- Task creation and management
- Kanban-style task tracking
- Real-time task updates
- File upload and management
- Dashboard with project and task statistics
- Reports and analytics
- User settings and profile information
- MongoDB-based data storage
- REST API backend
- React-based frontend

---

# 🚀 Features

## 1. Authentication & User Management

The application provides secure user authentication and role-based access.

Features include:

- User registration
- User login
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Current user information
- User profile details

### Supported Roles

- Admin
- Manager
- Team Member

---

## 2. Dashboard

The dashboard provides a centralized overview of the project management system.

It displays:

- Total projects
- Total tasks
- Completed tasks
- In-progress tasks
- Recent projects
- Project completion percentage
- Recent task activity
- Current tasks
- Project progress

The dashboard retrieves real-time information from the backend APIs and displays the latest project and task information.

---

## 3. Project Management

The Project Management module allows users to manage projects throughout their lifecycle.

### Project Features

- Create projects
- View projects
- Update projects
- Delete projects
- Add project descriptions
- Track project status
- View project progress
- Associate tasks with projects

### Project Status

Projects can have different workflow states such as:

- Planning
- In Progress
- Completed

---

## 4. Task Management

The Task Management module allows users to create, manage, and track tasks associated with projects.

### Task Features

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Add task descriptions
- Assign tasks to projects
- Set task priority
- Set task status
- Set task deadlines

### Task Status

Tasks are organized into:

- To Do
- In Progress
- Completed

### Task Priority

Tasks can have the following priorities:

- Low
- Medium
- High

---

## 5. Kanban Board

The Kanban Board provides a visual workflow for tracking task progress.

Tasks are organized into three columns:

```text
┌────────────┐    ┌──────────────┐    ┌─────────────┐
│   To Do    │ →  │ In Progress  │ →  │  Completed  │
└────────────┘    └──────────────┘    └─────────────┘
## 6. Real-Time Collaboration

The application uses Socket.io to support real-time task updates between connected users.

Real-time events include:

- Task creation
- Task updates
- Task deletion

When a task is created, updated, or deleted, connected users can receive the latest changes without manually refreshing the page.

---

## 7. File Management

The File Management module allows users to upload project-related files.

Files can be associated with:

- Projects
- Tasks

The system stores file information such as:

- Original file name
- Stored file name
- File type
- File size
- Project association
- Task association
- Uploaded user
- Upload timestamp

The backend uses Multer for handling file uploads.

---

## 8. Reports & Analytics

The Reports module provides analytical information about projects and tasks.

### Project Statistics

The system provides:

- Total projects
- Planning projects
- In-progress projects
- Completed projects
- Project progress

### Task Statistics

The system provides:

- Total tasks
- To Do tasks
- In-progress tasks
- Completed tasks

### Priority Statistics

The system provides:

- Low-priority tasks
- Medium-priority tasks
- High-priority tasks

### Completion Statistics

The system calculates the overall task completion percentage.

### Deadline Statistics

The system provides:

- Overdue tasks
- Upcoming tasks
- Tasks without deadlines
- Overdue projects
- Upcoming projects
- Projects without deadlines

---

## 9. Settings

The Settings page displays information about the currently authenticated user.

It includes:

- User name
- Email address
- User role
- Account creation date

The information is retrieved from the backend using the authenticated user's JWT token.

---

# 🛠️ Technologies Used

## Frontend

- React.js
- Vite
- JavaScript
- React Router
- CSS
- Socket.io Client

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Socket.io
- Multer

## Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

---

# 📁 Project Structure

```text
PROJECT_MANAGEMENT_TOOL/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── Kanban.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Tasks.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── socket.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── .gitignore