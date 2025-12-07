const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/study", require("./routes/studyRoutes"));
app.use("/api/question-bank", require("./routes/questionBank"));
app.use("/api/test-questions", require("./routes/testQuestions"));
app.use("/api/test", require("./routes/testSubmit"));  // ⬅️ Changed to testSubmit if that file exists

// ONLY NEW TEXT UPLOAD SYSTEM
app.use("/api/text-upload", require("./routes/textUpload"));

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

// 404 handler
app.use((req, res) => {
  console.log("❌ 404 - Route not found:", req.method, req.path);
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
  console.log("📋 Available routes:");
  console.log("   POST /api/test/submit");
  console.log("   GET  /api/test-questions/:subject");
  console.log("   GET  /api/study/heatmap");
});