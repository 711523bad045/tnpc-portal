import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "./AdminUpload.css";

function AdminQuestionUpload() {
  const [inputs, setInputs] = useState({
    tamil: "",
    english: "",
    maths: "",
    social: ""
  });

  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL; // <-- IMPORTANT

  const handleUpload = async (subject) => {
    if (!inputs[subject].trim()) {
      alert("❌ Please paste questions before uploading.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Please login as admin first.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/text-upload/upload/${subject}`,
        { text: inputs[subject] },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(
        `✅ ${subject.toUpperCase()} uploaded!\nTotal: ${res.data.count} questions`
      );

      setInputs({ ...inputs, [subject]: "" });
    } catch (err) {
      console.error("Upload error:", err);
      alert(
        err.response?.data?.error ||
          "❌ Upload failed — check format or backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-container">
        <h1 className="page-title">📘 Admin Question Upload</h1>

        {["tamil", "english", "maths", "social"].map((subj) => (
          <div className="upload-box" key={subj}>
            <h3>{subj.toUpperCase()} Questions</h3>

            <textarea
              placeholder={`Paste ${subj} questions here... (Q, A, B, C, D format)`}
              value={inputs[subj]}
              onChange={(e) =>
                setInputs({ ...inputs, [subj]: e.target.value })
              }
            />

            <button
              disabled={loading}
              onClick={() => handleUpload(subj)}
              className="upload-btn"
            >
              {loading ? "Uploading..." : `Upload ${subj}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminQuestionUpload;
