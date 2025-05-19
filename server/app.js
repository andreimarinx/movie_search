// server/server.js

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const checkApiKey = require("./services/auth");
const searchRouter = require("./routes/search");

const app = express();

//Middleware
//Standatd HTTP headers
app.use(helmet());
app.use(express.json());
//Limit number of requests
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  standardHeaders: true, // sets RateLimit-* headers
  legacyHeaders: false,  // disables X-RateLimit-* headers
  message: {
    status: 429,
    error: 'Too many requests, please try again after an hour'
  }
});
app.use(limiter);

//Mount Search
app.use("/search", checkApiKey, searchRouter);

//Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

module.exports = app