const express = require("express");
const router = express.Router();
const {
  getAllClients,
  GetUserById,
} = require("../Controllers/usersController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/get-all-users", authMiddleware, adminMiddleware, getAllClients);
router.get("/:userId", GetUserById);

module.exports = router;
