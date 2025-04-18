const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const hotspotRoutes = require("./routes/hotspotRoutes");
const aiDoctorRoutes = require("./routes/aiDoctorRoutes");
const userRoutes = require("./routes/user.routes.js");


const connectWithDb = require("./config/database");


require("dotenv").config();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectWithDb();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use(express.json());
app.use(cookieParser());
app.use("/api", hotspotRoutes);
app.use("/api/ai", aiDoctorRoutes);
app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});
