const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Notification = require("../models/Notification");

// POST /api/tasks — Create new task
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();

    // Store and emit notification
    const message = `📌 New task '${savedTask.title}' created.`;
    const notification = new Notification({ type: "success", message });
    await notification.save();

    // Emit to connected clients
    req.app.locals.io.emit("notification", {
      type: "success",
      message,
    });

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET task by ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// PUT update task
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Emit notification if marked completed
    if (updatedTask.status === "completed") {
      const message = `✅ Task '${updatedTask.title}' completed`;
      const notification = new Notification({ type: "success", message });
      await notification.save();

        req.app.locals.io.emit("notification", {
        message: `Task "${task.title}" marked as completed.`,
        type: "success",
        });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET task analytics
router.get("/analytics/summary", async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "completed" });
    const pending = await Task.countDocuments({ status: "pending" });
    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    res.json({ total, completed, pending, overdue });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
