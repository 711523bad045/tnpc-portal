import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import "./QuestionBank.css";

function QuestionBank() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">
        
        <div className="header-row">
          <h1 className="dashboard-title">📚 Question Bank</h1>
          <Link to="/admin/login">
            <button className="admin-btn">Admin Panel</button>
          </Link>
        </div>

        <div className="subject-grid">

          <Link to="/question-bank/tamil" className="subject-card">
            <h2>தமிழ்</h2>
            <p>View Tamil Questions</p>
          </Link>

          <Link to="/question-bank/english" className="subject-card">
            <h2>English</h2>
            <p>View English Questions</p>
          </Link>

          <Link to="/question-bank/maths" className="subject-card">
            <h2>Maths</h2>
            <p>View Maths Questions</p>
          </Link>

          <Link to="/question-bank/social" className="subject-card">
            <h2>Social</h2>
            <p>View Social Questions</p>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default QuestionBank;
