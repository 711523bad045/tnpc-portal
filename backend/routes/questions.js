const express = require("express");
const router = express.Router();

// TEMPORARY ROUTE — just to avoid errors
router.get("/", (req, res) => {
  res.json({ message: "Questions API working" });
});

module.exports = router;
