const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const settingsRoutes = require("./routes/settings");
const authRoutes = require("./routes/auth");


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ required for token/authenticated socket
  },
});


// ✅ Make io accessible to all route handlers via app.locals
app.locals.io = io;

// ✅ Middleware
const corsOptions = {
  origin: "http://localhost:3000", // ✅ your frontend URL
  credentials: true,               // ✅ allow cookies/authorization headers
};

app.use(cors(corsOptions));

app.use(express.json());

// ✅ Routes
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/team", require("./routes/team"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/search", require("./routes/search"));
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads")); // serve uploaded files


// ✅ Socket.IO events
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ✅ Server startup
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
