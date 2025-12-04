const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/study", require("./routes/studyRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/question-bank", require("./routes/uploadPdf"));
app.use("/api/question-bank", require("./routes/questionBankRoutes"));
app.use("/api/questions", require("./routes/questions"));

app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
