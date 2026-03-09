const express = require("express");
const authMiddleware = require("../middleware/auth_middleware");
const {
  getTasksHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require("../controllers/task_controller");

const router = express.Router();

router.use(authMiddleware);

router.route("/")
  .get(getTasksHandler)
  .post(createTaskHandler);

router.route("/:id")
  .put(updateTaskHandler)
  .delete(deleteTaskHandler);

module.exports = router;
