import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import "./TakeTest.css";

function TakeTest() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // LOAD QUESTIONS
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("Please login to take the test");
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/test-questions/${subject}`, {
        headers: { Authorization: `Bearer ${token}` }
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
  }, [subject, navigate]);

  // TIMER COUNTDOWN
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
  const handleSubmit = async () => {
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);
    
    // Calculate score
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });

    const finalScore = correct;
    const timeTaken = 300 - timeLeft;

    // SAVE RESULT IN DATABASE
    try {
      const token = localStorage.getItem("token");

      console.log("📤 Submitting test:", {
        subject,
        score: finalScore,
        totalQuestions: questions.length,
        timeTaken
      });

      const response = await axios.post(
        "http://localhost:5000/api/test/submit",
        {
          subject: subject,
          score: finalScore,
          totalQuestions: questions.length,
          timeTaken: timeTaken
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("✅ Test submitted successfully:", response.data);
      
      // Show results after successful save
      setScore(finalScore);
      setSubmitted(true);
      
    } catch (err) {
      console.error("❌ Error submitting test:", err.response?.data || err.message);
      
      // Show results even if save failed, but warn user
      setScore(finalScore);
      setSubmitted(true);
      
      const errorMsg = err.response?.data?.error || "Unknown error occurred";
      alert(`Test completed but failed to save results.\n\nError: ${errorMsg}\n\nYour score: ${finalScore}/${questions.length}\n\nPlease contact support or try taking the test again.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0 
    ? Math.round((answeredCount / questions.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-container">
          <div className="error-box">
            <h2>⚠️ {error}</h2>
            <button 
              className="upload-btn" 
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
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">

        {!submitted ? (
          <>
            <div className="test-header">
              <div>
                <h1 className="dashboard-title">
                  📝 {subject.charAt(0).toUpperCase() + subject.slice(1)} Test
                </h1>
                <p className="test-info">
                  {questions.length} Questions • 5 Minutes
                </p>
              </div>
              
              <div className="timer-box" style={{ 
                color: timeLeft < 60 ? "#ef4444" : "#3b82f6",
                fontWeight: "bold"
              }}>
                <span style={{ fontSize: "24px" }}>⏳</span>
                <span style={{ fontSize: "32px", marginLeft: "10px" }}>
                  {formatTimer()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-info">
                <span>Progress: {answeredCount} / {questions.length} answered</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="questions-container">
              {questions.map((q, index) => (
                <div 
                  key={q.id} 
                  className={`question-card ${answers[q.id] ? 'answered' : ''}`}
                >
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    {answers[q.id] && (
                      <span className="answered-badge">✓ Answered</span>
                    )}
                  </div>
                  
                  <p className="question-text">{q.question}</p>

                  <div className="options-container">
                    {["A", "B", "C", "D"].map((opt) => (
                      <label 
                        key={opt}
                        className={`option-label ${
                          answers[q.id] === opt ? 'selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          checked={answers[q.id] === opt}
                          onChange={() => chooseAnswer(q.id, opt)}
                        />
                        <span className="option-letter">{opt}</span>
                        <span className="option-text">
                          {q[`option_${opt.toLowerCase()}`]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="submit-container">
              <button 
                className="submit-btn" 
                onClick={handleSubmit}
                disabled={submitting || answeredCount === 0}
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
              {answeredCount < questions.length && (
                <p className="warning-text">
                  ⚠️ You have {questions.length - answeredCount} unanswered question(s)
                </p>
              )}
            </div>
          </>
        ) : (
          // RESULT PAGE
          <div className="result-container">
            <div className="result-header">
              <h1 className="result-title">
                {score >= questions.length * 0.8 ? "🎉" : score >= questions.length * 0.5 ? "👍" : "📚"} 
                Test Completed!
              </h1>
              
              <div className="score-card">
                <div className="score-big">
                  {score} / {questions.length}
                </div>
                <div className="score-percentage">
                  {Math.round((score / questions.length) * 100)}% Correct
                </div>
              </div>

              <div className="result-stats">
                <div className="stat-item">
                  <span className="stat-label">Time Taken</span>
                  <span className="stat-value">
                    {Math.floor((300 - timeLeft) / 60)}m {(300 - timeLeft) % 60}s
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Subject</span>
                  <span className="stat-value">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="review-title">📘 Answer Review</h2>

            <div className="review-container">
              {questions.map((q, index) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.answer;

                return (
                  <div 
                    key={q.id} 
                    className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="review-header">
                      <span className="review-number">Question {index + 1}</span>
                      <span className={`review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <p className="review-question">{q.question}</p>

                    <div className="review-answers">
                      <div className="answer-row">
                        <span className="answer-label">Your Answer:</span>
                        <span className={`answer-value ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {userAnswer ? `${userAnswer}) ${q[`option_${userAnswer.toLowerCase()}`]}` : "Not answered"}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <div className="answer-row">
                          <span className="answer-label">Correct Answer:</span>
                          <span className="answer-value correct">
                            {q.answer}) {q[`option_${q.answer.toLowerCase()}`]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="result-actions">
              <button 
                className="btn-primary" 
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => navigate("/daily-test")}
              >
                Take Another Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeTest;