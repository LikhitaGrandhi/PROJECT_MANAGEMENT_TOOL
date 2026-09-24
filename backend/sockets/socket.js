const { Server } = require("socket.io");

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join project room
    socket.on("join-project", (projectId) => {
      if (!projectId) return;

      socket.join(`project-${projectId}`);
      console.log("Joined project:", projectId);
    });

    // Leave project room
    socket.on("leave-project", (projectId) => {
      if (!projectId) return;

      socket.leave(`project-${projectId}`);
      console.log("Left project:", projectId);
    });

    // Receive file upload notification
    socket.on("file-uploaded", (data) => {
      if (!data || !data.projectId) return;

      socket.to(`project-${data.projectId}`).emit(
        "file-uploaded",
        data
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;