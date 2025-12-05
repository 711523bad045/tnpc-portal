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
app.use("/api/test-submit", require("./routes/testSubmit"));

// ONLY NEW TEXT UPLOAD SYSTEM
app.use("/api/text-upload", require("./routes/textUpload"));

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port", PORT));
