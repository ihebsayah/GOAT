const express = require("express");
const {
  getUser,
  loginUser,
  updateUser,
  deleteUser,
  currentUser,
  getAllUsers,
  recommendationSystem,
} = require("../controllers/agentController");
const validateToken = require("../middleware/validateToken");
const { createAgentUser } = require("../controllers/agentController");
const router = express.Router();
router.get("/current", validateToken, currentUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/register", createAgentUser);
router.post("/login", loginUser, validateToken);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/recommend", validateToken, recommendationSystem);

module.exports = router;
