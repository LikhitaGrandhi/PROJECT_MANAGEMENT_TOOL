const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            members,
            status,
            startDate,
            deadline
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Project name is required"
            });
        }

        const project = await Project.create({
            name,
            description,
            owner: req.user.id,
            members: members || [],
            status: status || "Planning",
            startDate,
            deadline
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });
    } catch (error) {
        console.error("Create project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
};

// Get All Projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("owner", "name email role")
            .populate("members", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });
    } catch (error) {
        console.error("Get projects error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch projects"
        });
    }
};

// Get Single Project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "name email role")
            .populate("members", "name email role");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            project
        });
    } catch (error) {
        console.error("Get project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch project"
        });
    }
};

// Update Project
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        Object.assign(project, req.body);

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        console.error("Update project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to update project"
        });
    }
};

// Delete Project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        await project.deleteOne();

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Delete project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete project"
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
};