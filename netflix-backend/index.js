require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Enable CORS with credentials and set allowed origin
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Mount authentication routes
app.use("/api/auth", authRoutes);

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(5000, () => console.log("Server running on port 5000"));