// server/src/server.js

require("dotenv").config();

const express = require("express");
const app = express();

//Mount Search
const searchRouter = require("./routes/search");
app.use("/search", searchRouter);

//Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
