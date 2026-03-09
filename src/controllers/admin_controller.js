const { getAllUsers, deleteUser, updateUserRole } = require("../utils");

const getUsersHandler = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const users = await getAllUsers();
  return res.json(users);
};

const deleteUserHandler = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const user = await deleteUser(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.json({ msg: "user deleted" });
};

const updateUserRoleHandler = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "admin access required" });
  }

  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "admin"];
  if (!role || !allowedRoles.includes(role)) {
    return res.status(400).json({ error: "role must be 'user' or 'admin'" });
  }

  if (req.user.id === id) {
    return res.status(400).json({ error: "you cannot change your own role" });
  }

  const updated = await updateUserRole(id, role);

  if (!updated) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.json({ msg: `user role updated to ${role}`, user: updated });
};

module.exports = {
  getUsersHandler,
  deleteUserHandler,
  updateUserRoleHandler,
};
