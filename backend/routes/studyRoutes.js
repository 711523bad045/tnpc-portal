// backend/routes/studyRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// SAVE / UPDATE today's minutes
router.post("/update", auth, (req, res) => {
  const user_id = req.user.id;
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

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekly = DAYS.map((day) => ({ day, minutes: 0 }));

    rows.forEach((row) => {
      const d = new Date(row.date).getDay();
      const idx = d === 0 ? 6 : d - 1;
      weekly[idx].minutes = Number(row.minutes);
    });

    res.json(weekly);
  });
});

// GET monthly data (last 30 days with day number)
router.get("/monthly", auth, (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT date, minutes
    FROM study_progress
    WHERE user_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
    ORDER BY date ASC
  `;
  
  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /monthly:", err);
      return res.status(500).json({ error: "DB error" });
    }

    // Build a map of date -> minutes
    const map = {};
    rows.forEach((r) => (map[r.date] = Number(r.minutes)));

    // Create array for last 30 days
    const out = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      out.push({ 
        date: iso, 
        day: d.getDate(),
        minutes: map[iso] || 0 
      });
    }

    res.json(out);
  });
});

// GET daily data (last 14 days with detailed info)
router.get("/daily", auth, (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT date, minutes
    FROM study_progress
    WHERE user_id = ?
      AND date >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
    ORDER BY date ASC
  `;
  
  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /daily:", err);
      return res.status(500).json({ error: "DB error" });
    }

    // Build a map of date -> minutes
    const map = {};
    rows.forEach((r) => (map[r.date] = Number(r.minutes)));

    // Create array for last 14 days
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const out = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      out.push({ 
        date: iso,
        day: d.getDate(),
        dayName: DAYS[d.getDay()],
        minutes: map[iso] || 0 
      });
    }

    res.json(out);
  });
});

// GET current streak
router.get("/streak", auth, (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT date, minutes
    FROM study_progress
    WHERE user_id = ?
      AND date <= CURDATE()
      AND minutes > 0
    ORDER BY date DESC
  `;
  
  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("DB error /streak:", err);
      return res.status(500).json({ error: "DB error" });
    }

    if (!rows || rows.length === 0) {
      return res.json({ streak: 0 });
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < rows.length; i++) {
      const rowDate = new Date(rows[i].date);
      rowDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);
      expectedDate.setHours(0, 0, 0, 0);

      if (rowDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  });
});

module.exports = router;