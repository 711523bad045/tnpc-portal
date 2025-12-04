const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// ===============================
// 👉 GET QUESTIONS (search supported)
// ===============================
router.get("/questions", auth, (req, res) => {
  const search = req.query.search || "";

  const sql = `
    SELECT id, question, option_a, option_b, option_c, option_d, answer
    FROM questions
    WHERE question LIKE ?
  `;

  db.query(sql, [`%${search}%`], (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// ===============================
// 👉 SUBMIT TEST RESULTS
// ===============================
router.post("/submit", auth, (req, res) => {
  const { score, total, timeTaken } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO tests (user_id, score, total, time_taken)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [userId, score, total, timeTaken], (err) => {
    if (err) {
      console.error("Test submit error:", err);
      return res.status(500).json({ error: "Submit failed" });
    }

    res.json({ message: "Test submitted successfully" });
  });
});

module.exports = router;
