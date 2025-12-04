const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM questions ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json(result);
  });
});

module.exports = router;
