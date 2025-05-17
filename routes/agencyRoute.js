const express = require("express");
const {
  getUser,
  loginUser,
  updateUser,
  deleteUser,
  currentUser,
  getAllAgencyUsers,
  recommendationSystem,
} = require("../controllers/agencyContorller");
const validateToken = require("../middleware/validateToken");
const { createAgencyUser } = require("../controllers/agencyContorller");
const router = express.Router();
router.get("/current", validateToken, currentUser);
router.get("/", getAllAgencyUsers);
router.get("/:id", getUser);
router.post("/register", createAgencyUser);
router.post("/login", loginUser, validateToken);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/recommend", validateToken, recommendationSystem);

module.exports = router;
