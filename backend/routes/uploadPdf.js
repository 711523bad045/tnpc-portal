const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const db = require("../db");
const auth = require("../middleware/auth");

// memory storage
const upload = multer({ storage: multer.memoryStorage() });

// MCQ regex
const mcqPattern =
/(\d+)\.\s*(.*?)\n[aA]\)\s*(.*?)\n[bB]\)\s*(.*?)\n[cC]\)\s*(.*?)\n[dD]\)\s*(.*?)(?=\n\d+\.|\n*$)/gs;

router.post("/upload", auth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    let match;
    let count = 0;

    while ((match = mcqPattern.exec(text)) !== null) {
      const question = match[2].trim();
      const option_a = match[3].trim();
      const option_b = match[4].trim();
      const option_c = match[5].trim();
      const option_d = match[6].trim();
      const answer = "A"; // default

      await db.query(
        `INSERT INTO questions (question, option_a, option_b, option_c, option_d, answer)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [question, option_a, option_b, option_c, option_d, answer]
      );

      count++;
    }

    res.json({ message: "Uploaded successfully", count });

  } catch (err) {
    console.error("PDF Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
