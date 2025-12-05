const express = require("express");
const router = express.Router();
const db = require("../db");

const tables = {
  tamil: "tamil_questions",
  english: "english_questions",
  maths: "maths_questions",
  social: "social_questions",
};

// GET QUESTIONS BY SUBJECT
router.get("/:subject", (req, res) => {
  const { subject } = req.params;

  if (!tables[subject]) {
    return res.status(400).json({ error: "Invalid subject" });
  }

  const table = tables[subject];

  const sql = `SELECT * FROM ${table} ORDER BY id DESC`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
});

module.exports = router;
