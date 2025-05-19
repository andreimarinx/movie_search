require("dotenv").config();

const express = require("express");

const router = express.Router();

//Get search result
router.post("/:title", (req, res) => {
  console.log(req.params.search);
});

router.get("/", (req, res) => {
  console.log("test");
  res.json({ success: "true" });
});

module.exports = router;
