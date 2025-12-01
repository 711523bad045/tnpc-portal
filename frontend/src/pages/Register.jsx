import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔥 Show loading spinner

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      if (res.data.message === "User registered successfully") {

        // Automatically login the user after register
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password
        });

        if (loginRes.data.token) {
          localStorage.setItem("token", loginRes.data.token);

          // 🔥 Redirect to dashboard directly
          navigate("/dashboard");
        }

      } else {
        alert(res.data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Server Error");
      console.log(err);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="register-page">

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
