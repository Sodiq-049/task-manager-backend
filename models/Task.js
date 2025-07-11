// models/Task.js
const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  assignee: String,
  dueDate: Date,
  tags: [String],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);
