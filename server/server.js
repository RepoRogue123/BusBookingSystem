const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");
const { initializeNotificationSchedulers } = require("./utils/notificationScheduler");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/user-preferences", require("./routes/userPreferencesRoutes"));

// listen to port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // Initialize notification schedulers after server starts
  initializeNotificationSchedulers();
});
