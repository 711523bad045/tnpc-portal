const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "tnpc_secret_key"; // change later if needed

// REGISTER API
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (results.length > 0) {
      return res.json({ error: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err, result) => {
        if (err) {
          return res.json({ error: err });
        }
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

// LOGIN API
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (results.length === 0) {
      return res.json({ error: "Email not found" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    res.json({ message: "Login successful", token });
  });
});

module.exports = router;
