import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      if (res.data.message === "User registered successfully") {
        alert("Registered Successfully!");
        navigate("/login");  // 🔥 redirect to login page
      } else {
        alert(res.data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Server Error");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        /><br />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        /><br />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
