const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

/* -----------------------------------------------------
   SUBMIT TEST RESULT
----------------------------------------------------- */
router.post("/submit", auth, (req, res) => {
  const userId = req.user.id; // Get from auth middleware
  const { subject, score, totalQuestions, timeTaken } = req.body;

  console.log("📥 Received test submission:", {
    userId,
    subject,
    score,
    totalQuestions,
    timeTaken
  });

  // Validate required fields
  if (!subject || score == null || totalQuestions == null) {
    console.error("❌ Validation failed: Missing fields");
    return res.status(400).json({ 
      error: "Missing required fields",
      details: {
        subject: !subject ? "missing" : "ok",
        score: score == null ? "missing" : "ok",
        totalQuestions: totalQuestions == null ? "missing" : "ok"
      }
    });
  }

  // Validate data types
  if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
    console.error("❌ Validation failed: Invalid data types");
    return res.status(400).json({ 
      error: "Invalid data types",
      details: {
        score: typeof score,
        totalQuestions: typeof totalQuestions
      }
    });
  }

  const sql = `
    INSERT INTO test_results (user_id, subject, score, total_questions, time_taken, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [userId, subject, score, totalQuestions, timeTaken || 0], (err, result) => {
    if (err) {
      console.error("❌ DATABASE ERROR:", err.message);
      console.error("SQL Error Code:", err.code);
      return res.status(500).json({ 
        error: "Database error",
        message: err.message,
        code: err.code
      });
    }

    console.log("✅ Test result saved successfully:", { 
      testId: result.insertId,
      userId, 
      subject, 
      score, 
      totalQuestions,
      timeTaken
    });
    
    res.status(200).json({ 
      success: true,
      message: "Result saved successfully!",
      testId: result.insertId,
      score: score,
      totalQuestions: totalQuestions
    });
  });
});

/* -----------------------------------------------------
   GET USER'S TEST HISTORY
----------------------------------------------------- */
router.get("/history", auth, (req, res) => {
  const userId = req.user.id;
  const { subject, limit = 10 } = req.query;

  let sql = `
    SELECT id, subject, score, total_questions, time_taken, created_at
    FROM test_results
    WHERE user_id = ?
  `;
  
  const params = [userId];

  if (subject) {
    sql += ` AND subject = ?`;
    params.push(subject);
  }

  sql += ` ORDER BY created_at DESC LIMIT ?`;
  params.push(parseInt(limit));

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("❌ GET HISTORY ERROR:", err);
      return res.status(500).json({ error: "Could not fetch test history" });
    }

    res.json(rows);
  });
});

/* -----------------------------------------------------
   GET TEST STATS SUMMARY
----------------------------------------------------- */
router.get("/stats", auth, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      subject,
      COUNT(*) as total_tests,
      AVG(score) as avg_score,
      MAX(score) as best_score,
      SUM(score) as total_score
    FROM test_results
    WHERE user_id = ?
    GROUP BY subject
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ GET STATS ERROR:", err);
      return res.status(500).json({ error: "Could not fetch test stats" });
    }

    res.json(rows);
  });
});

module.exports = router;