const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const TeamMember = require("../models/TeamMember");

router.get("/", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  try {
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { status: { $regex: query, $options: "i" } }
      ]
    });

    const projects = await Project.find({
      name: { $regex: query, $options: "i" }
    });

    const team = await TeamMember.find({
      name: { $regex: query, $options: "i" }
    });

    res.json({ tasks, projects, team });
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

module.exports = router;
