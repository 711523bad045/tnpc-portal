import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "./QuestionBank.css";

function QuestionBank() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const uploadPdf = () => {
    if (!file) {
      setStatus("Please choose a PDF file!");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    axios
      .post("http://localhost:5000/api/question-bank/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setStatus(`Uploaded successfully! Extracted ${res.data.count} questions.`);
      })
      .catch(() => setStatus("Upload failed. Please try again."));
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Page Content */}
      <div className="dashboard-container">
        <h1 className="dashboard-title">📚 Upload Question Bank (PDF)</h1>
        <p className="dashboard-subtitle">
          Upload any TNPSC / Aptitude / GS question bank PDF — system will extract
          questions automatically.
        </p>

        <div className="upload-card">
          <label className="file-label">
            Choose PDF File
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button className="upload-btn" onClick={uploadPdf}>
            Upload PDF
          </button>

          {status && <p className="upload-status">{status}</p>}
        </div>
      </div>
    </div>
  );
}

export default QuestionBank;
