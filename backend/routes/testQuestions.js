const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

/* -----------------------------------------------------
   GET RANDOM TEST QUESTIONS FOR A SUBJECT
   Returns 10 random questions from the subject-specific table
----------------------------------------------------- */
router.get("/:subject", auth, (req, res) => {
  const { subject } = req.params;
  const limit = 10; // Number of questions per test

  // Validate subject and map to table name
  const validSubjects = {
    "tamil": "tamil_questions",
    "english": "english_questions",
    "maths": "maths_questions",
    "social": "social_questions"
  };

  const tableName = validSubjects[subject.toLowerCase()];
  
  if (!tableName) {
    return res.status(400).json({ 
      error: "Invalid subject. Must be one of: tamil, english, maths, social" 
    });
  }

  // Get random questions from the subject-specific table
  // Using template literal for table name (safe because we validated it above)
  const sql = `
    SELECT id, question, option_a, option_b, option_c, option_d, answer
    FROM ${tableName}
    ORDER BY RAND()
    LIMIT ?
  `;

  db.query(sql, [limit], (err, rows) => {
    if (err) {
      console.error(`❌ Error fetching questions from ${tableName}:`, err);
      return res.status(500).json({ error: "Failed to load questions" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ 
        error: `No questions found for ${subject}`,
        message: "Please contact admin to add questions for this subject"
      });
    }

    console.log(`✅ Loaded ${rows.length} questions from ${tableName}`);
    res.json(rows);
  });
});

/* -----------------------------------------------------
   GET ALL AVAILABLE SUBJECTS WITH QUESTION COUNTS
----------------------------------------------------- */
router.get("/subjects/available", auth, (req, res) => {
  const subjects = [
    { name: "tamil", table: "tamil_questions" },
    { name: "english", table: "english_questions" },
    { name: "maths", table: "maths_questions" },
    { name: "social", table: "social_questions" }
  ];

  const queries = subjects.map(subject => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as count FROM ${subject.table}`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.error(`Error counting ${subject.table}:`, err);
          resolve({ subject: subject.name, question_count: 0 });
        } else {
          resolve({ 
            subject: subject.name, 
            question_count: rows[0].count 
          });
        }
      });
    });
  });

  Promise.all(queries)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      console.error("❌ Error fetching subjects:", err);
      res.status(500).json({ error: "Failed to load subjects" });
    });
});

module.exports = router;