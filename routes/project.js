const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Create a new project
router.post("/", async (req, res) => {
  try {
    const { name, description, deadline } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = new Project({ name, description, deadline }); // ✅ include deadline
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Optional: Get all projects (for sidebar loading later)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
