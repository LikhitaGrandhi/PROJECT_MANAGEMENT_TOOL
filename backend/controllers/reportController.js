const Project = require("../models/Project");
const Task = require("../models/Task");

const getReport = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const totalTasks = await Task.countDocuments();

        const completedProjects = await Project.countDocuments({
            status: "Completed"
        });

        const completedTasks = await Task.countDocuments({
            status: "Completed"
        });

        const inProgressProjects = await Project.countDocuments({
            status: "In Progress"
        });

        const inProgressTasks = await Task.countDocuments({
            status: "In Progress"
        });

        const overdueTasks = await Task.countDocuments({
            deadline: { $lt: new Date() },
            status: { $ne: "Completed" }
        });

        const overdueProjects = await Project.countDocuments({
            deadline: { $lt: new Date() },
            status: { $ne: "Completed" }
        });

        const taskCompletionPercentage =
            totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

        const projectCompletionPercentage =
            totalProjects === 0
                ? 0
                : Math.round((completedProjects / totalProjects) * 100);

        res.status(200).json({
            success: true,
            report: {
                totalProjects,
                completedProjects,
                inProgressProjects,
                projectCompletionPercentage,

                totalTasks,
                completedTasks,
                inProgressTasks,
                taskCompletionPercentage,

                overdueTasks,
                overdueProjects
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
    getReport
};