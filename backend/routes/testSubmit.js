const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/submit", (req, res) => {
  const { userId, subject, score, totalQuestions, timeTaken } = req.body;

  if (!subject || score == null || !totalQuestions) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const sql = `
    INSERT INTO test_results (user_id, subject, score, total_questions, time_taken)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, subject, score, totalQuestions, timeTaken], (err) => {
    if (err) {
      console.error("SAVE ERROR:", err);
      return res.status(500).json({ error: "Could not save test result" });
    }

    res.json({ message: "Result saved successfully!" });
  });
});

module.exports = router;
