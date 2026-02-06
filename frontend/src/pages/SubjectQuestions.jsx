import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import "./QuestionBank.css";

function SubjectQuestions() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL; // <-- IMPORTANT

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view questions");
      navigate("/login");
      return;
    }

    setLoading(true);

    axios
      .get(`${API}/api/question-bank/${subject}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestions(res.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ Error loading questions:", err);
        setError("Failed to load questions");
        setQuestions([]);
      })
      .finally(() => setLoading(false));
  }, [subject, navigate, API]);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-container">
          <h2>Loading questions...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-container">
          <h2>⚠️ {error}</h2>
          <button onClick={() => navigate("/question-bank")}>
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">
          📘 {subject.toUpperCase()} Questions
        </h1>

        <div className="question-list">
          {questions.length === 0 ? (
            <p>No questions found.</p>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="question-item">
                <p>
                  <strong>Q:</strong> {q.question}
                </p>
                <ul>
                  <li>A) {q.option_a}</li>
                  <li>B) {q.option_b}</li>
                  <li>C) {q.option_c}</li>
                  <li>D) {q.option_d}</li>
                </ul>
                <p>
                  <strong>Answer:</strong> {q.answer}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectQuestions;
