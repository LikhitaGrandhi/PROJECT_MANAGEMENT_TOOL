const Task = require("../models/Task");

// Create a task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            status,
            priority,
            deadline
        } = req.body;

        if (!title || !project) {
            return res.status(400).json({
                success: false,
                message: "Task title and project are required"
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy: req.user.id,
            status,
            priority,
            deadline
        });

        // Send real-time task creation event
        const io = req.app.get("io");

        if (io) {
            io.to(`project-${project}`).emit("task-created", task);
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("project", "name status")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role");

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get single task
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("project", "name status")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Remember the old project in case the task is moved
        const oldProjectId = task.project
            ? task.project.toString()
            : null;

        task.title = req.body.title ?? task.title;
        task.description = req.body.description ?? task.description;
        task.project = req.body.project ?? task.project;
        task.assignedTo = req.body.assignedTo ?? task.assignedTo;
        task.status = req.body.status ?? task.status;
        task.priority = req.body.priority ?? task.priority;
        task.deadline = req.body.deadline ?? task.deadline;

        await task.save();

        // Send real-time task update event
        const io = req.app.get("io");

        if (io) {
            const newProjectId = task.project
                ? task.project.toString()
                : null;

            if (newProjectId) {
                io.to(`project-${newProjectId}`).emit(
                    "task-updated",
                    task
                );
            }

            // If the task was moved to another project,
            // remove it from users in the old project.
            if (
                oldProjectId &&
                newProjectId &&
                oldProjectId !== newProjectId
            ) {
                io.to(`project-${oldProjectId}`).emit(
                    "task-deleted",
                    {
                        taskId: task._id,
                        projectId: oldProjectId
                    }
                );
            }
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Save project ID before deleting the task
        const projectId = task.project
            ? task.project.toString()
            : null;

        await task.deleteOne();

        // Send real-time task deletion event
        const io = req.app.get("io");

        if (io && projectId) {
            io.to(`project-${projectId}`).emit(
                "task-deleted",
                {
                    taskId: task._id,
                    projectId
                }
            );
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};