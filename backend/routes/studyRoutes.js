// backend/routes/studyRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// SAVE / UPDATE today's minutes
router.post("/update", auth, (req, res) => {
  const user_id = req.user.id;
  // Expect minutes as decimal or integer (we store as DECIMAL)
  const minutes = Number(req.body.minutes || 0);
  const today = new Date().toISOString().split("T")[0];

  const sql = `
    INSERT INTO study_progress (user_id, date, minutes, last_update)
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE minutes = ?, last_update = NOW()
  `;

  db.query(sql, [user_id, today, minutes, minutes], (err) => {
    if (err) {
      console.error("DB error /update:", err);
      return res.status(500).json({ error: "DB error" });
    }
    return res.json({ message: "Saved", minutes });
  });
});

// GET today's saved minutes
router.get("/today", auth, (req, res) => {
  const user_id = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const sql = "SELECT minutes FROM study_progress WHERE user_id = ? AND date = ?";

  db.query(sql, [user_id, today], (err, rows) => {
    if (err) {
      console.error("DB error /today:", err);
      return res.status(500).json({ error: "DB error" });
    }
    if (!rows || rows.length === 0) return res.json({ minutes: 0 });
    return res.json({ minutes: Number(rows[0].minutes) });
  });
});

// GET weekly aggregated data (Mon..Sun)
router.get("/weekly", auth, (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT date, minutes
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

    // Prepare Mon..Sun
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    // default 0
    const weekly = DAYS.map((day) => ({ day, minutes: 0 }));

    rows.forEach((row) => {
      const d = new Date(row.date).getDay(); // 0=Sun
      const idx = d === 0 ? 6 : d - 1;
      weekly[idx].minutes = Number(row.minutes);
    });

    res.json(weekly);
  });
});

// GET yearly heatmap data (last 365 days)
// returns array [{ date: '2025-12-02', minutes: 10 }, ...]
router.get("/yearly", auth, (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT date, minutes
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

    // Build a map of date -> minutes
    const map = {};
    rows.forEach((r) => (map[r.date] = Number(r.minutes)));

    // Create array for last 365 days
    const out = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      out.push({ date: iso, minutes: map[iso] || 0 });
    }

    res.json(out);
  });
});

module.exports = router;
