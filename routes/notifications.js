const express = require("express");
const router = express.Router();

// TEMP: Replace this with database logic later
const notifications = [
  // Example dynamic notifications
  { id: 1, type: "success", message: "Task 'Project Setup' completed" },
  { id: 2, type: "comment", message: "New comment on 'Design Wireframe'" },
  { id: 3, type: "warning", message: "Deadline for 'Marketing Plan' is tomorrow" }
];

router.get("/", (req, res) => {
  res.json(notifications); // You can return [] if none exist
});

// Clear all notifications
router.delete("/clear", async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
