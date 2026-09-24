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

        task.title = req.body.title ?? task.title;
        task.description = req.body.description ?? task.description;
        task.project = req.body.project ?? task.project;
        task.assignedTo = req.body.assignedTo ?? task.assignedTo;
        task.status = req.body.status ?? task.status;
        task.priority = req.body.priority ?? task.priority;
        task.deadline = req.body.deadline ?? task.deadline;

        await task.save();

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

        await task.deleteOne();

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