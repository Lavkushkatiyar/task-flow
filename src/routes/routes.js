const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const authRoutes = require("./auth.routes");
const taskRoutes = require("./task.routes");
const adminRoutes = require("./admin.routes");

const router = express.Router();

// Auth routes (public)
router.use("/auth", authRoutes);

// Protected routes
router.use("/tasks", taskRoutes);
router.use("/", adminRoutes); // This covers /users and /users/:id/role

router.get("/profile", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
