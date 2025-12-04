const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const db = require("../db");

// Configure file upload
const upload = multer({ storage: multer.memoryStorage() });

// Upload PDF → extract questions → save to DB
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // Extract MCQs using regex
    const mcqPattern = /(\d+)\.\s*(.*?)\n[aA]\)\s*(.*?)\n[bB]\)\s*(.*?)\n[cC]\)\s*(.*?)\n[dD]\)\s*(.*?)(?=\n\d+\.|\n*$)/gs;

    let match;
    let count = 0;

    while ((match = mcqPattern.exec(text)) !== null) {
      const question = match[2].trim();
      const option_a = match[3].trim();
      const option_b = match[4].trim();
      const option_c = match[5].trim();
      const option_d = match[6].trim();
      const answer = "A"; // default

      const sql = `
        INSERT INTO questions 
        (question, option_a, option_b, option_c, option_d, answer)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      await db.query(sql, [
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        answer
      ]);

      count++;
    }

    res.json({ message: "Upload successful", count });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
