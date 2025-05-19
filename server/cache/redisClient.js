// server/cache/redisClient.js

const { createClient } = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// only auto-connect when not in test
if (process.env.NODE_ENV !== "test") {
  (async () => {
    await redisClient.connect();
    console.log("Connected to Redis");
  })();
}

module.exports = redisClient;
