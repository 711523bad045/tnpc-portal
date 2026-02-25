const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// REGEX TO CAPTURE FULL MCQ BLOCK
// ===============================
// Format Required:
//
// 1. Question text
// A) Option A
// B) Option B
// C) Option C
// D) Option D
// Correct Answer: B)
// ===============================

const mcqPattern =
/(\d+)\.\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*Correct Answer:\s*([A-D])\)/gs;

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

  if (!text || text.trim().length < 5) {
    return res.status(400).json({ error: "Empty or invalid text" });
  }

  const table = tables[subject];

  let match;
  let count = 0;

  function insertNext() {
    match = mcqPattern.exec(text);

    if (!match) {
      return res.json({
        message: "✅ Uploaded successfully",
        totalInserted: count
      });
    }

    const question = match[2].trim();
    const optionA = match[3].trim();
    const optionB = match[4].trim();
    const optionC = match[5].trim();
    const optionD = match[6].trim();
    const correctAnswer = match[7].trim().toUpperCase();

    const sql = `
      INSERT INTO ${table}
      (question, option_a, option_b, option_c, option_d, answer)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [question, optionA, optionB, optionC, optionD, correctAnswer],
      (err) => {
        if (err) {
          console.error("❌ Upload DB Error:", err);
          return res.status(500).json({ error: "Database insert error" });
        }

        count++;
        insertNext(); // continue next question
      }
    );
  }

  insertNext();
});

module.exports = router;