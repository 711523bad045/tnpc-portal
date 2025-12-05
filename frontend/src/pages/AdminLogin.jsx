import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";   // ✅ Sidebar Added
import "./Admin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // ✅ ALLOW ONLY YOU
    if (email === "kit27.ad45@gmail.com" && password === "123456") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/question-bank");  // redirect to admin panel
    } else {
      alert("❌ Invalid Admin Credentials");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE ADMIN LOGIN AREA */}
      <div className="admin-login-page">

        <div className="admin-box">
          <h2>🔐 Admin Login</h2>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
          />

          <button onClick={handleLogin} className="admin-login-btn">
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
