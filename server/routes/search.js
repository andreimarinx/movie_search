// server/src/routes/search.js

const express = require("express");
const router = express.Router();
const { query, validationResult } = require("express-validator");

const redisClient = require("../cache/redisClient");

const omdb = require("../services/omdb");

//Get search result
router.get(
  "/",
  [
    query("title").trim().notEmpty().withMessage("Query parameter `title` is required"),
    query("page").optional().isInt({ min: 1 }).withMessage("`page` must be an integer >= 1").toInt(),
  ],
  async (req, res) => {
    console.log(`Incoming request: GET /search?title=${req.query.title}&page=${req.query.page || 1}`);

    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const title = req.query.title;
    const page = req.query.page || 1;
    const cacheKey = `search:${title}:${page}`;

    try {
      //Try cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log("Loaded from cache");
        return res.json(JSON.parse(cached));
      }

      //Fecth OMDB
      const { movies, totalResults } = await omdb.searchMovies(title, page);
      const totalPages = Math.ceil(totalResults / 10);

      const payload = {
        page,
        totalResults,
        totalPages,
        count: movies.length,
        results: movies,
      };

      //Cache for 1 hour
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(payload));

      return res.json(payload);
    } catch (error) {
      console.log("Error fetching external data:", error.message);
      res.status(500).json({ error: "Failed to fetch external data" });
    }
  }
);

module.exports = router;
