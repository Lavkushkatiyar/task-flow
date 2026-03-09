const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const {
  getUsersHandler,
  deleteUserHandler,
  updateUserRoleHandler,
} = require("../controllers/admin_controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/users", getUsersHandler);
router.delete("/users/:id", deleteUserHandler);
router.put("/users/:id/role", updateUserRoleHandler);

module.exports = router;
