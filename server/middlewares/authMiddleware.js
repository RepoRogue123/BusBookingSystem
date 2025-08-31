const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Auth failed",
        success: false,
      });
    }
    const decodedToken = jwt.verify(token, process.env.jwt_secret);
  // Backward compatibility for routes using params
  req.params.userId = decodedToken.userId;
  // Standard way used by most controllers
  req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};
