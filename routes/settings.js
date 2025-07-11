const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

// GET current settings for user
router.get("/:userId", async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.params.userId });
    if (!settings) return res.status(404).json({ msg: "Settings not found" });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update settings
router.put("/:userId", async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
