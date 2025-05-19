// server/server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const checkApiKey = require("./services/auth");
const searchRouter = require("./routes/search");

const app = express();

//Middleware
//Cros
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);
//Standatd HTTP headers
app.use(helmet());
app.use(express.json());
//Limit number of requests
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100000, // 100 requestes / ip / window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again after an hour",
  },
});
app.use(limiter);

//Mount Search
app.use("/search", checkApiKey, searchRouter);

//Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

module.exports = app;
