import React, { useState } from "react";
import { loginUser } from "../api";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "useradmin@gmail.com",
    password: "admin1234"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const result = await loginUser(form.email, form.password);
      console.log("Login Success", result);
      // Store token
      localStorage.setItem("token", result.token);

      // Redirect to inventory page
      navigate("/inventory");

    } catch (err) {
      console.log("Loggin Error", err);
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input-field"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input-field"
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      {message && (
        <p
          className={message.includes("success") ? "success-msg" : "error-msg"}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;