import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";

function TakeTest() {
  const { subject } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // LOAD QUESTIONS
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/test-questions/${subject}`)
      .then((res) => setQuestions(res.data))
      .catch(() => setQuestions([]));
  }, [subject]);

  // TIMER COUNTDOWN
  useEffect(() => {
    if (submitted) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // FORMAT TIMER
  const formatTimer = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // RECORD ANSWER
  const chooseAnswer = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  // SUBMIT TEST
  const handleSubmit = () => {
    let correct = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    // SAVE RESULT IN BACKEND
    axios.post("http://localhost:5000/api/test-submit/submit", {
      userId: 1, // replace with logged-in user ID
      subject,
      score: correct,
      totalQuestions: questions.length,
      timeTaken: 300 - timeLeft
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">

        {!submitted ? (
          <>
            <h1 className="dashboard-title">📝 {subject.toUpperCase()} Test</h1>
            <h2 style={{ color: timeLeft < 10 ? "red" : "white" }}>
              ⏳ Time Left: {formatTimer()}
            </h2>

            {questions.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              questions.map((q, index) => (
                <div key={q.id} className="question-item">
                  <p><strong>{index + 1}. {q.question}</strong></p>

                  {["A", "B", "C", "D"].map((opt) => (
                    <label key={opt}>
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        onChange={() => chooseAnswer(q.id, opt)}
                      />
                      {opt}) {q[`option_${opt.toLowerCase()}`]}
                      <br />
                    </label>
                  ))}
                </div>
              ))
            )}

            <button className="upload-btn" onClick={handleSubmit}>
              Submit Test
            </button>
          </>
        ) : (
          // RESULT PAGE
          <div className="result-box">
            <h1>🎉 Test Completed!</h1>
            <h2>Score: {score} / {questions.length}</h2>
            <h3>Time Taken: {300 - timeLeft} seconds</h3>

            <h2>📘 Answers & Explanations</h2>

            {questions.map((q, index) => (
              <div key={q.id} className="question-item">
                <p><strong>{index + 1}. {q.question}</strong></p>
                <p>Your Answer: {answers[q.id] || "Not answered"}</p>
                <p>Correct Answer: {q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeTest;
