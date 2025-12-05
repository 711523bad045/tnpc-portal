const express = require("express");
const router = express.Router();
const db = require("../db");

// REGEX
const mcqPattern =
/(\d+)\.\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)(?=\n\d+\.|\s*$)/gs;

const tables = {
  tamil: "tamil_questions",
  english: "english_questions",
  maths: "maths_questions",
  social: "social_questions",
};

router.post("/upload/:subject", (req, res) => {
  const { subject } = req.params;
  const { text } = req.body;

  if (!tables[subject]) {
    return res.status(400).json({ error: "Invalid subject" });
  }
  if (!text || text.trim().length < 3) {
    return res.status(400).json({ error: "Empty text" });
  }

  const table = tables[subject];

  let match;
  let count = 0;

  function insertNext() {
    match = mcqPattern.exec(text);
    if (!match) {
      return res.json({ message: "Uploaded successfully", count });
    }

    const question = match[2].trim();
    const a = match[3].trim();
    const b = match[4].trim();
    const c = match[5].trim();
    const d = match[6].trim();

    const sql = `
      INSERT INTO ${table}
      (question, option_a, option_b, option_c, option_d, answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [question, a, b, c, d, "A"], (err) => {
      if (err) {
        console.error("UPLOAD ERROR:", err);
        return res.status(500).json({ error: "Database insert error" });
      }

      count++;
      insertNext(); // continue inserting
    });
  }

  insertNext();
});

module.exports = router;
