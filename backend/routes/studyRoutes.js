const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Save or update today's study minutes
router.post("/update", auth, (req, res) => {
  const user_id = req.user.id;
  const minutes = req.body.minutes;
  const today = new Date().toISOString().split("T")[0];

  const sql =
    "INSERT INTO study_progress (user_id, date, minutes, last_update) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE minutes = ?, last_update = NOW()";

  db.query(sql, [user_id, today, minutes, minutes], (err) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ message: "Saved" });
  });
});

// Fetch weekly study minutes
router.get("/weekly", auth, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT date, minutes 
    FROM study_progress
    WHERE user_id = ?
    ORDER BY date ASC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekly = DAYS.map((d) => ({ day: d, minutes: 0 }));

    rows.forEach((row) => {
      const day = new Date(row.date).getDay(); // 0–6
      const index = day === 0 ? 6 : day - 1;
      weekly[index].minutes = row.minutes;
    });

    res.json(weekly);
  });
});

module.exports = router;
