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

  const handleUpload = async (subject) => {
    if (!inputs[subject].trim()) {
      alert("❌ Please paste questions before uploading.");
      return;
    }

    try {
      setLoading(true);

      // ⭐ FIXED ENDPOINT
      const res = await axios.post(
        `http://localhost:5000/api/text-upload/upload/${subject}`,
        { text: inputs[subject] }
      );

      alert(`✅ ${subject.toUpperCase()} uploaded!\nTotal: ${res.data.count} questions`);

      setInputs({ ...inputs, [subject]: "" });
    } 
    catch (err) {
      console.error(err);
      alert("❌ Upload failed — check format or backend.");
    }
    finally {
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
