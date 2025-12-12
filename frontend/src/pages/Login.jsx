import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // ⭐ For validation popup

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const showError = (msg) => {
    setErrorMsg(msg);

    // Auto-hide after 3 seconds
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⭐ Frontend validation
    if (!form.email.trim() || !form.password.trim()) {
      showError("⚠️ Please enter both email and password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        showError(res.data.error || "❌ Invalid Credentials");
      }
    } catch (error) {
      // ⭐ Backend error handler (User not exist, wrong password, etc.)
      if (error.response && error.response.data && error.response.data.error) {
        showError(error.response.data.error);
      } else {
        showError("❌ Server Error — Try again later");
      }
    }
  };

  return (
    <div className="login-page">

      {/* 🔥 Center Popup Error Message */}
      {errorMsg && (
        <div className="error-popup">
          {errorMsg}
        </div>
      )}

      {/* 🔥 Tamil Title */}
      <div className="tamil-header">
        தமிழ்நாடு அரசு குழு 4 தேர்வு பயிற்சி தளம்
      </div>

      <div className="login-box">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password + eye icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
