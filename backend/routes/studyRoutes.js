const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

/* -----------------------------------------------------
   SAVE / UPDATE TODAY'S SECONDS
----------------------------------------------------- */
router.post("/update", auth, (req, res) => {
  const user_id = req.user.id;
  const seconds = Number(req.body.seconds || 0);
  const minutes = seconds / 60;

  const today = new Date().toISOString().split("T")[0];

  const sql = `
    INSERT INTO study_progress (user_id, date, minutes, seconds, last_update)
    VALUES (?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      minutes = VALUES(minutes),
      seconds = VALUES(seconds),
      last_update = NOW()
  `;

  db.query(sql, [user_id, today, minutes, seconds], (err) => {
    if (err) {
      console.error("DB error /update:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json({ message: "Saved", seconds, minutes });
  });
});

/* -----------------------------------------------------
   GET TODAY'S SECONDS
----------------------------------------------------- */
router.get("/today", auth, (req, res) => {
  const user_id = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const sql = "SELECT seconds FROM study_progress WHERE user_id = ? AND date = ?";

  db.query(sql, [user_id, today], (err, rows) => {
    if (err) {
      console.error("DB error /today:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const seconds = rows.length ? Number(rows[0].seconds) : 0;
    res.json({ seconds });
  });
});

/* -----------------------------------------------------
   MONTHLY TOTAL (return minutes)
----------------------------------------------------- */
router.get("/monthly", auth, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT SUM(seconds) AS total_seconds
    FROM study_progress
    WHERE user_id = ?
      AND MONTH(date) = MONTH(CURDATE())
      AND YEAR(date) = YEAR(CURDATE())
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /monthly:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const seconds = rows[0].total_seconds || 0;
    const minutes = seconds / 60;

    res.json({ total: minutes });
  });
});

/* -----------------------------------------------------
   STUDY STREAK (counts consecutive days with >0 seconds)
----------------------------------------------------- */
router.get("/streak", auth, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT date, seconds
    FROM study_progress
    WHERE user_id = ?
    ORDER BY date DESC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /streak:", err);
      return res.status(500).json({ error: "DB error" });
    }

    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const row of rows) {
      const logDate = new Date(row.date);
      logDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === current.getTime() && row.seconds > 0) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({ streak });
  });
});

/* -----------------------------------------------------
   WEEKLY (Mon-Sun)
----------------------------------------------------- */
router.get("/weekly", auth, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT date, seconds
    FROM study_progress
    WHERE user_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    ORDER BY date ASC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /weekly:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekly = DAYS.map((d) => ({ day: d, minutes: 0 }));

    rows.forEach((row) => {
      const dayIndex = new Date(row.date).getDay();
      const idx = dayIndex === 0 ? 6 : dayIndex - 1;

      weekly[idx].minutes = (row.seconds || 0) / 60;
    });

    res.json(weekly);
  });
});

/* -----------------------------------------------------
   YEARLY (Past 365 days)
----------------------------------------------------- */
router.get("/yearly", auth, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT date, seconds
    FROM study_progress
    WHERE user_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 364 DAY)
    ORDER BY date ASC
  `;

  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /yearly:", err);
      return res.status(500).json({ error: "DB error" });
    }

    const map = {};
    rows.forEach((r) => {
      map[r.date] = (r.seconds || 0) / 60;
    });

    const out = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];

      out.push({
        date: iso,
        minutes: map[iso] || 0,
      });
    }

    res.json(out);
  });
});

module.exports = router;