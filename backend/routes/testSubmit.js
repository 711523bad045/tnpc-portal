const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user; // Attach user info to request
    next();
  });
};

// Submit test result - FIXED VERSION
router.post("/submit", authenticateToken, (req, res) => {
  const { subject, score, totalQuestions, timeTaken } = req.body;
  const userId = req.user.id; // Get userId from JWT token

  console.log("📥 Received test submission:", {
    userId,
    subject,
    score,
    totalQuestions,
    timeTaken
  });

  // Validation
  if (!subject || score == null || !totalQuestions) {
    return res.status(400).json({ 
      error: "Missing required fields",
      received: { subject, score, totalQuestions, timeTaken }
    });
  }

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const sql = `
    INSERT INTO test_results (user_id, subject, score, total_questions, time_taken, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql, 
    [userId, subject, score, totalQuestions, timeTaken || 0], 
    (err, result) => {
      if (err) {
        console.error("❌ Database save error:", err);
        return res.status(500).json({ 
          error: "Could not save test result",
          details: err.message 
        });
      }

      console.log("✅ Test result saved successfully! ID:", result.insertId);
      
      res.json({ 
        message: "Test result saved successfully!",
        testId: result.insertId,
        score: score,
        totalQuestions: totalQuestions
      });
    }
  );
});

module.exports = router;