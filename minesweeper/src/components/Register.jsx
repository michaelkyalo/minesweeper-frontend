// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ Registered successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMsg(data.message || "⚠️ Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setMsg("⚠️ Server error. Try again later.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {msg && <div style={{ color: "red", marginBottom: "10px" }}>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

// ✅ Single default export for Vite/React
export default Register;

