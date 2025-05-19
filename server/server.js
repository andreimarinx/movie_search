// server/src/server.js

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
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // each ip has 100 requests / window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

//Mount Search
app.use("/search", checkApiKey, searchRouter);

//Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
