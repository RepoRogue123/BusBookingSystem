const express = require("express");
const router = express();

const {
  AddBus,
  GetAllBuses,
  UpdateBus,
  DeleteBus,
  GetBusById,
  GetBusesByFromAndTo,
} = require("../Controllers/busController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/add-bus", authMiddleware, adminMiddleware, AddBus);
router.post("/get-all-buses", authMiddleware, adminMiddleware, GetAllBuses);
router.put("/:id", authMiddleware, adminMiddleware, UpdateBus);
router.delete("/:id", authMiddleware, adminMiddleware, DeleteBus);
router.get("/:id", authMiddleware, GetBusById);
router.post("/get", authMiddleware, GetBusesByFromAndTo);

module.exports = router;
