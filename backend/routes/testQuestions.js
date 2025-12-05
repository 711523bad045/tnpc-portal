const express = require("express");
const router = express.Router();
const db = require("../db");

const tables = {
  tamil: "tamil_questions",
  english: "english_questions",
  maths: "maths_questions",
  social: "social_questions",
};

router.get("/:subject", (req, res) => {
  const { subject } = req.params;

  if (!tables[subject]) {
    return res.status(400).json({ error: "Invalid subject" });
  }

  const table = tables[subject];
  const sql = `
    SELECT id, question, option_a, option_b, option_c, option_d, answer
    FROM ${table}
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Trim answer to avoid spaces like "A "
    const clean = rows.map(q => ({
      ...q,
      answer: q.answer.trim()
    }));

    res.json(clean);
  });
});

module.exports = router;
