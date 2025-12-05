import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import "./QuestionBank.css";

function SubjectQuestions() {
  const { subject } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/question-bank/${subject}`)
      .then((res) => setQuestions(res.data))
      .catch((err) => {
        console.error(err);
        setQuestions([]);
      });
  }, [subject]);

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
                <p><strong>Q:</strong> {q.question}</p>
                <ul>
                  <li>A) {q.option_a}</li>
                  <li>B) {q.option_b}</li>
                  <li>C) {q.option_c}</li>
                  <li>D) {q.option_d}</li>
                </ul>
                <p><strong>Answer:</strong> {q.answer}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default SubjectQuestions;
