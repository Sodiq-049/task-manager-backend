const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Simulate user middleware (replace with real auth middleware in production)
const getUserId = (req) => req.user?.id || "64e123abc456def789000000";

// GET all notifications for a user
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const notes = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ✅ GET unread notifications for a user
router.get("/unread", async (req, res) => {
  try {
    const userId = getUserId(req);
    const unread = await Notification.find({ userId, read: false }).sort({ createdAt: -1 });
    res.json(unread);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unread notifications" });
  }
});

// ✅ Mark a specific notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const userId = getUserId(req);
    const note = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { read: true },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Notification not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete all notifications for a user
router.delete("/clear", async (req, res) => {
  try {
    const userId = getUserId(req);
    await Notification.deleteMany({ userId });
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
