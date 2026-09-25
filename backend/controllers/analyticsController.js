const Project = require("../models/Project");
const Task = require("../models/Task");

const getAnalytics = async (req, res) => {
    try {
        // =========================
        // PROJECT STATISTICS
        // =========================

        const totalProjects = await Project.countDocuments();

        const planningProjects = await Project.countDocuments({
            status: "Planning"
        });

        const inProgressProjects = await Project.countDocuments({
            status: "In Progress"
        });

        const completedProjects = await Project.countDocuments({
            status: "Completed"
        });

        // =========================
        // TASK STATISTICS
        // =========================

        const totalTasks = await Task.countDocuments();

        const todoTasks = await Task.countDocuments({
            status: "To Do"
        });

        const inProgressTasks = await Task.countDocuments({
            status: "In Progress"
        });

        const completedTasks = await Task.countDocuments({
            status: "Completed"
        });

        // =========================
        // TASK PRIORITY
        // =========================

        const lowPriorityTasks = await Task.countDocuments({
            priority: "Low"
        });

        const mediumPriorityTasks = await Task.countDocuments({
            priority: "Medium"
        });

        const highPriorityTasks = await Task.countDocuments({
            priority: "High"
        });

        // =========================
        // OVERALL COMPLETION
        // =========================

        const completionPercentage =
            totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

        // =========================
        // PROJECT-WISE PROGRESS
        // =========================

        const projects = await Project.find();

        const projectProgress = [];

        for (const project of projects) {
            const projectTotalTasks = await Task.countDocuments({
                project: project._id
            });

            const projectCompletedTasks = await Task.countDocuments({
                project: project._id,
                status: "Completed"
            });

            const progress =
                projectTotalTasks === 0
                    ? 0
                    : Math.round(
                        (projectCompletedTasks / projectTotalTasks) * 100
                    );

            projectProgress.push({
                projectId: project._id,
                projectName: project.name,
                totalTasks: projectTotalTasks,
                completedTasks: projectCompletedTasks,
                progress
            });
        }

        // =========================
        // DEADLINE ANALYTICS
        // =========================

        const now = new Date();

        const nextSevenDays = new Date();
        nextSevenDays.setDate(nextSevenDays.getDate() + 7);

        // Task deadlines

        const overdueTasks = await Task.countDocuments({
            deadline: { $lt: now },
            status: { $ne: "Completed" }
        });

        const upcomingTasks = await Task.countDocuments({
            deadline: {
                $gte: now,
                $lte: nextSevenDays
            },
            status: { $ne: "Completed" }
        });

        const noDeadlineTasks = await Task.countDocuments({
            deadline: null
        });

        // Project deadlines

        const overdueProjects = await Project.countDocuments({
            deadline: { $lt: now },
            status: { $ne: "Completed" }
        });

        const upcomingProjects = await Project.countDocuments({
            deadline: {
                $gte: now,
                $lte: nextSevenDays
            },
            status: { $ne: "Completed" }
        });

        const noDeadlineProjects = await Project.countDocuments({
            deadline: null
        });

        // =========================
        // RESPONSE
        // =========================

        res.status(200).json({
            success: true,

            analytics: {
                totalProjects,

                projectStats: {
                    planningProjects,
                    inProgressProjects,
                    completedProjects
                },

                totalTasks,

                taskStats: {
                    todoTasks,
                    inProgressTasks,
                    completedTasks
                },

                priorityStats: {
                    lowPriorityTasks,
                    mediumPriorityTasks,
                    highPriorityTasks
                },

                completionPercentage,

                projectProgress,

                deadlineStats: {
                    overdueTasks,
                    upcomingTasks,
                    noDeadlineTasks,

                    overdueProjects,
                    upcomingProjects,
                    noDeadlineProjects
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAnalytics
};