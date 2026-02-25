import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import "./TakeTest.css";

function TakeTest() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // =========================
  // LOAD QUESTIONS (FIXED)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to take the test");
      navigate("/login");
      return;
    }

    setLoading(true);

    axios
      // ✅ FIXED (removed extra /api)
      .get(`${API}/test-questions/${subject}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setQuestions(res.data);
          setError(null);
        } else {
          setError(`No questions available for ${subject}`);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading questions:", err);
        setError("Failed to load questions. Please try again.");
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, [subject, navigate, API]);

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    if (submitted || questions.length === 0) return;

    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, questions.length]);

  useEffect(() => {
    if (submitted && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [submitted]);

  const formatTimer = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const chooseAnswer = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  // =========================
  // SUBMIT TEST (FIXED)
  // =========================
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    const finalScore = correct;
    const timeTaken = 300 - timeLeft;

    try {
      const token = localStorage.getItem("token");

      const payload = {
        subject,
        score: finalScore,
        totalQuestions: questions.length,
        timeTaken,
      };

      // ✅ FIXED (removed extra /api)
      await axios.post(
        `${API}/test/submit`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setScore(finalScore);
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Submit error:", err);
      setScore(finalScore);
      setSubmitted(true);
      alert(
        `Test finished but result may not be saved.\nYour score: ${finalScore}/${questions.length}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="loading-container">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">⚠️ {error}</div>
            <button
              className="btn-primary"
              onClick={() => navigate("/daily-test")}
            >
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        {!submitted ? (
          <>
            <div className="test-header">
              <h2>
                📝 {subject.charAt(0).toUpperCase() + subject.slice(1)} Test
              </h2>
              <div className="timer-box">⏳ {formatTimer()}</div>
            </div>

            {questions.map((q, index) => (
              <div key={q.id} className="question-card">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>

                {["A", "B", "C", "D"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === opt}
                      onChange={() => chooseAnswer(q.id, opt)}
                    />
                    {opt}) {q[`option_${opt.toLowerCase()}`]}
                  </label>
                ))}
              </div>
            ))}

            <button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </>
        ) : (
          <div ref={resultsRef}>
            <h2>Test Completed!</h2>
            <h3>{score} / {questions.length}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeTest;