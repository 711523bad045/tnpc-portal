import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./DailyTest.css";

function DailyTest() {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [answers, setAnswers] = useState({});
  const [timerActive, setTimerActive] = useState(false);

  // ============================
  // Load Questions from DB
  // ============================
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/test/questions?search=${search}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.log("Fetch error:", err));
  }, [search]);

  // ============================
  // Timer Logic
  // ============================
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((sec) => sec - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startTest = () => {
    if (questions.length === 0) {
      alert("No questions available to start test!");
      return;
    }
    setTestStarted(true);
    setTimerActive(true);
  };

  const onAnswer = (id, option) => {
    setAnswers({ ...answers, [id]: option });
  };

  // ============================
  // Submit Test
  // ============================
  const submitTest = () => {
    setTimerActive(false);

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    axios
      .post(
        "http://localhost:5000/api/test/submit",
        {
          score,
          total: questions.length,
          timeTaken: 1800 - timeLeft,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      .then(() => alert(`Test submitted! Score: ${score}/${questions.length}`))
      .catch(() => alert("Error submitting test"));
  };

  return (
    <div className="dailytest-layout">
      <Sidebar />

      <div className="dailytest-container">
        <h1 className="test-title">Daily Test</h1>

        {/* ================= PREVIEW MODE ================= */}
        {!testStarted && (
          <>
            <div className="search-row">
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-box"
              />

              <button className="start-btn" onClick={startTest}>
                Start Test (30 mins)
              </button>
            </div>

            <h3 className="section-title">Questions ({questions.length})</h3>

            <div className="preview-box">
              {questions.length === 0 && (
                <p className="no-questions">No questions found.</p>
              )}

              {questions.map((q) => (
                <div key={q.id} className="preview-item">
                  <p className="preview-question">• {q.question}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= TEST MODE ================= */}
        {testStarted && (
          <div className="test-area">
            <h2 className="timer">
              Time Left: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </h2>

            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <p className="question-text">{q.question}</p>

                {["A", "B", "C", "D"].map((opt) => (
                  <label key={opt} className="option-label">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={() => onAnswer(q.id, opt)}
                    />
                    {q["option_" + opt.toLowerCase()]}
                  </label>
                ))}
              </div>
            ))}

            <button className="submit-btn" onClick={submitTest}>
              Submit Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyTest;
