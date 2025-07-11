const express = require("express");
const router = express.Router();
const TeamMember = require("../models/TeamMember");
const sendInvite = require("../utils/sendInvite"); // You must create this file

// GET all members
router.get("/", async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new member with name, email, and role
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: "Name, email, and role are required." });
    }

    const member = new TeamMember({ name, email, role });
    const saved = await member.save();

    // Send invite email
    await sendInvite({ name, email, role });

    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding team member:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE member by ID
router.delete("/:id", async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
