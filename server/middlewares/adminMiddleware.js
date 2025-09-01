const User = require("../models/usersModel");

// Ensures the authenticated user is an admin; otherwise responds with 403
module.exports = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).send({ success: false, message: "Auth failed" });
    }
    const user = await User.findById(userId).lean();
    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .send({ success: false, message: "Forbidden: Admin access required" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: error.message || "Server error" });
  }
};
