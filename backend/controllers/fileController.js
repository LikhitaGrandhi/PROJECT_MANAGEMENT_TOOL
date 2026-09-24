const File = require("../models/File");

const uploadFile = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a file",
      });
    }

    const { projectId, taskId } = req.body;

    // Project ID is required
    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    // Save file details in MongoDB
    const uploadedFile = await File.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      projectId: projectId,
      taskId: taskId || null,
      uploadedBy: req.user?._id || null,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      file: uploadedFile,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadFile };