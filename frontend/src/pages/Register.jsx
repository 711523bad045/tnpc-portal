import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  // ✅ Correct API base URL (must end with /api)
  const API = import.meta.env.VITE_API_URL;

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showError("⚠️ Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      showError("⚠️ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // ✅ CORRECT REGISTER ENDPOINT
      const res = await axios.post(
        `${API}/auth/register`,
        form
      );

      if (res.data.message === "User registered successfully") {
        // Auto-login after register
        const loginRes = await axios.post(
          `${API}/auth/login`,
          {
            email: form.email,
            password: form.password
          }
        );

        if (loginRes.data.token) {
          localStorage.setItem("token", loginRes.data.token);
          navigate("/dashboard");
        } else {
          showError("Login failed after register");
        }
      } else {
        showError(res.data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Register error:", err);

      if (err.response?.data?.error) {
        showError(err.response.data.error);
      } else {
        showError("❌ Server Error — Try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {errorMsg && <div className="error-popup">{errorMsg}</div>}

      <div className="tamil-header">
        தமிழ்நாடு அரசு குழு 4 தேர்வு பயிற்சி தளம்
      </div>

      <div className="register-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

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

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
