// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
