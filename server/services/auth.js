// server/src/services/auth.js

function checkApiKey(req, res, next) {
  const key = req.header("x-api-key");

  if (!key || key !== process.env.API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }

  next();
}

module.exports = checkApiKey;
