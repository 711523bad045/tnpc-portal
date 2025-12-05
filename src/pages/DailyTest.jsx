import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import "./QuestionBank.css";

function DailyTest() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">
        
        <h1 className="dashboard-title">📝 Daily Test</h1>

        <div className="subject-grid">

          <Link to="/daily-test/tamil" className="subject-card">
            <h2>தமிழ்</h2>
            <p>Start Tamil Test</p>
          </Link>

          <Link to="/daily-test/english" className="subject-card">
            <h2>English</h2>
            <p>Start English Test</p>
          </Link>

          <Link to="/daily-test/maths" className="subject-card">
            <h2>Maths</h2>
            <p>Start Maths Test</p>
          </Link>

          <Link to="/daily-test/social" className="subject-card">
            <h2>Social</h2>
            <p>Start Social Test</p>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default DailyTest;
