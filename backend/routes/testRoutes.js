const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

/* -----------------------------------------------------
   SUBMIT TEST - SIMPLE VERSION
----------------------------------------------------- */
router.post("/submit", auth, (req, res) => {
  const userId = req.user.id;
  const { subject, score, totalQuestions, timeTaken } = req.body;

  console.log("📥 Test submission from user:", userId);

  const sql = `
    INSERT INTO test_results (user_id, subject, score, total_questions, time_taken, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [userId, subject, score, totalQuestions, timeTaken || 0], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to save" });
    }

    console.log("✅ Saved! Test ID:", result.insertId);
    res.json({ success: true, testId: result.insertId });
  });
});

module.exports = router;