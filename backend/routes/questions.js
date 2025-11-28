const express = require("express");
const router = express.Router();
const db = require("../db");

// Add Question
router.post("/add", (req, res) => {
  const {
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
    explanation,
    subject,
    exam_type,
    difficulty
  } = req.body;

  const sql = `
    INSERT INTO questions 
    (question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, subject, exam_type, difficulty) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, subject, exam_type, difficulty],
    (err, result) => {
      if (err) return res.json({ error: err });
      return res.json({ message: "Question added successfully" });
    }
  );
});

// Get Questions (with filters)
router.get("/", (req, res) => {
  const { subject, exam_type, difficulty } = req.query;
  let sql = "SELECT * FROM questions WHERE 1=1";

  if (subject) sql += ` AND subject='${subject}'`;
  if (exam_type) sql += ` AND exam_type='${exam_type}'`;
  if (difficulty) sql += ` AND difficulty='${difficulty}'`;

  db.query(sql, (err, results) => {
    if (err) return res.json({ error: err });
    return res.json(results);
  });
});

module.exports = router;
