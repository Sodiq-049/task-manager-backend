const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); 

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/test", (req, res) => {
  res.send("✅ Auth route working");
});

router.put("/profile", verifyToken, async (req, res) => {
  const { name, email, profilePic } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Profile Update Route with image
router.put("/profile", verifyToken, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email } = req.body;

    user.name = name || user.name;
    user.email = email || user.email;

    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const { password, ...rest } = user._doc;
    res.json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/tasks
router.post("/", verifyToken, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      status: req.body.status, // "todo", "in-progress", or "done"
      project: req.body.projectId || null,
      assignedTo: req.user.id,
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
